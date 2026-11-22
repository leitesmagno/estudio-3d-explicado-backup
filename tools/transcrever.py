"""Transcreve a narração palavra por palavra (faster-whisper) para sincronizar o vídeo.

Uso:
    python tools/transcrever.py "projetos/NNN. nome" [--motor auto|groq|local] [--modelo large-v3-turbo] [--idioma pt]

Motor:
    auto  (padrão) usa a Groq na nuvem se a chave estiver no Chaveiro (serviço groq-agente); se falhar, usa o local
    groq  Whisper large-v3 na nuvem da Groq: cerca de 2 s para 3 min de narração, sem pesar o Mac
    local faster-whisper no próprio computador (lento e pesado, mas não depende de internet)

Lê:    projetos/NNN. nome/audio/narracao-norm.wav   (ou --audio <arquivo>)
Grava: projetos/NNN. nome/transcricao/palavras.json  lista de {"w": palavra, "s": início, "e": fim} em segundos
       projetos/NNN. nome/transcricao/transcript.md  o texto por frases, com o tempo de cada uma

Se já existir um palavras.json, ele é guardado antes como palavras-anterior.json.
Na primeira vez o modelo é baixado (large-v3-turbo tem cerca de 1,6 GB). Em computador simples use --modelo small.
O roteiro-falado.txt, se existir, é usado como dica de vocabulário (nomes, siglas, números).
Instalação: pip install -r tools/requirements.txt (dentro do .venv do Estúdio).
"""
import argparse
import json
import os
import shutil
import sys
import time

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def mmss(seg):
    m = int(seg // 60)
    return "%02d:%06.3f" % (m, seg - 60 * m)


def escolher_dispositivo(pedido):
    if pedido != "auto":
        return pedido
    try:
        import ctranslate2

        if ctranslate2.get_cuda_device_count() > 0:
            return "cuda"
    except Exception:
        pass
    return "cpu"


def frases(palavras):
    """Agrupa palavras em frases (quebra em . ? ! ou pausa maior que 0,7 s)."""
    out, cur = [], []
    for i, p in enumerate(palavras):
        cur.append(p)
        prox = palavras[i + 1] if i + 1 < len(palavras) else None
        fim = p["w"].rstrip().endswith((".", "?", "!", "…"))
        pausa = prox is not None and prox["s"] - p["e"] > 0.7
        if fim or pausa or prox is None:
            out.append(cur)
            cur = []
    return out


def chave_groq():
    k = os.environ.get("GROQ_KEY")
    if k:
        return k
    try:
        import subprocess
        r = subprocess.run(["security", "find-generic-password", "-s", "groq-agente", "-w"], capture_output=True, text=True)
        return r.stdout.strip() or None
    except Exception:
        return None


def transcrever_groq(audio, idioma, dica, chave):
    """Whisper large-v3 na Groq. Devolve (palavras, duração). Levanta exceção se falhar."""
    import subprocess, tempfile, urllib.request, uuid
    tmp = tempfile.mkdtemp()
    mp3 = os.path.join(tmp, "narracao.mp3")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", audio, "-ac", "1", "-ar", "16000", "-b:a", "48k", mp3], check=True)
    if os.path.getsize(mp3) > 24 * 1024 * 1024:
        raise RuntimeError("áudio maior que 24 MB para a Groq")
    campos = [("model", "whisper-large-v3"), ("language", idioma), ("response_format", "verbose_json"),
              ("timestamp_granularities[]", "word"), ("temperature", "0")]
    if dica:
        campos.append(("prompt", dica[:400]))
    b = uuid.uuid4().hex
    corpo = b""
    for k, v in campos:
        corpo += ("--%s\r\nContent-Disposition: form-data; name=\"%s\"\r\n\r\n%s\r\n" % (b, k, v)).encode()
    corpo += ("--%s\r\nContent-Disposition: form-data; name=\"file\"; filename=\"narracao.mp3\"\r\nContent-Type: audio/mpeg\r\n\r\n" % b).encode()
    corpo += open(mp3, "rb").read() + ("\r\n--%s--\r\n" % b).encode()
    req = urllib.request.Request("https://api.groq.com/openai/v1/audio/transcriptions", data=corpo, method="POST",
                                 headers={"Authorization": "Bearer " + chave, "Content-Type": "multipart/form-data; boundary=" + b,
                                          "User-Agent": "estudio-3d-transcrever"})
    with urllib.request.urlopen(req, timeout=300) as r:
        d = json.loads(r.read())
    palavras = []
    for w in d.get("words") or []:
        txt = (w.get("word") or "").strip()
        if txt:
            palavras.append({"w": txt, "s": round(float(w["start"]), 2), "e": round(float(w["end"]), 2)})
    if not palavras:
        raise RuntimeError("a Groq não devolveu palavras")
    # a Groq devolve as palavras sem pontuação; põe de volta a pontuação do texto para as frases do transcript.md
    texto = d.get("text") or ""
    pos = 0
    for p in palavras:
        i = texto.find(p["w"], pos)
        if i < 0:
            continue
        j = i + len(p["w"])
        while j < len(texto) and texto[j] in ".,!?;:…":
            j += 1
        p["w"] = texto[i:j]
        pos = j
    dur = float(d.get("duration") or 0) or palavras[-1]["e"]
    # a Groq às vezes estica o fim da última palavra além do áudio: limita ao tamanho real
    for p in palavras:
        p["e"] = round(min(p["e"], dur, p["s"] + 2.5), 2)
    return palavras, dur


def main():
    ap = argparse.ArgumentParser(description="Transcreve a narração com tempo de cada palavra.")
    ap.add_argument("pasta", help='pasta do projeto, ex.: "projetos/001. escala 6x1"')
    ap.add_argument("--motor", default="auto", choices=["auto", "groq", "local"], help="auto (Groq se tiver chave), groq ou local")
    ap.add_argument("--audio", default=None, help="arquivo de áudio (padrão: audio/narracao-norm.wav)")
    ap.add_argument("--modelo", default="large-v3-turbo", help="tiny, base, small, medium, large-v3, large-v3-turbo")
    ap.add_argument("--idioma", default="pt")
    ap.add_argument("--dispositivo", default="auto", help="auto, cpu ou cuda")
    ap.add_argument("--sem-dica", action="store_true", help="não usar o roteiro como dica de vocabulário")
    a = ap.parse_args()

    pasta = a.pasta if os.path.isabs(a.pasta) else os.path.join(RAIZ, a.pasta)
    audio = a.audio or os.path.join(pasta, "audio", "narracao-norm.wav")
    if not os.path.isabs(audio):
        audio = os.path.join(RAIZ, audio)
    if not os.path.exists(audio):
        sys.exit("Áudio não encontrado: %s" % audio)
    saida = os.path.join(pasta, "transcricao")
    os.makedirs(saida, exist_ok=True)

    dica = None
    roteiro = os.path.join(pasta, "audio", "roteiro-falado.txt")
    if not a.sem_dica and os.path.exists(roteiro):
        with open(roteiro, encoding="utf-8") as f:
            dica = " ".join(f.read().split())[:600]

    palavras = None
    if a.motor in ("auto", "groq"):
        chave = chave_groq()
        if chave:
            print("Transcrevendo na nuvem (Groq, whisper-large-v3)...", flush=True)
            t0 = time.time()
            try:
                palavras, dur = transcrever_groq(audio, a.idioma, dica, chave)
                gasto = time.time() - t0
                a.modelo, disp = "groq whisper-large-v3", "nuvem"
            except Exception as e:
                if a.motor == "groq":
                    sys.exit("A Groq falhou: %s" % e)
                print("A Groq falhou (%s). Usando o modo local." % e, flush=True)
        elif a.motor == "groq":
            sys.exit("Sem chave da Groq no Chaveiro (serviço groq-agente).")

    if palavras is None:
        palavras, dur, gasto, disp = transcrever_local(a, audio, dica)
    gravar(palavras, dur, gasto, disp, a, saida)


def transcrever_local(a, audio, dica):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit("faster-whisper não está instalado. Rode: pip install -r tools/requirements.txt (no .venv do Estúdio).")

    disp = escolher_dispositivo(a.dispositivo)
    tipo = "float16" if disp == "cuda" else "int8"
    print("Carregando o modelo %s (%s)..." % (a.modelo, disp), flush=True)
    t0 = time.time()
    modelo = WhisperModel(a.modelo, device=disp, compute_type=tipo)
    # Lê o áudio com o ffmpeg (16 kHz, mono): versões novas do pacote av quebram o leitor do faster_whisper.
    import subprocess
    import numpy as np
    bruto = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                           capture_output=True, check=True).stdout
    sinal = np.frombuffer(bruto, np.int16).astype(np.float32) / 32768.0
    segmentos, info = modelo.transcribe(
        sinal,
        language=a.idioma,
        word_timestamps=True,
        beam_size=5,
        vad_filter=False,
        condition_on_previous_text=False,
        initial_prompt=dica,
    )
    palavras = []
    dur = getattr(info, "duration", 0) or 0
    for seg in segmentos:
        for w in seg.words or []:
            txt = w.word.strip()
            if not txt:
                continue
            palavras.append({"w": txt, "s": round(float(w.start), 2), "e": round(float(w.end), 2)})
        if dur:
            print("  %3d%%" % min(100, int(100 * seg.end / dur)), flush=True)
    gasto = time.time() - t0
    return palavras, dur, gasto, disp


def gravar(palavras, dur, gasto, disp, a, saida):
    arq = os.path.join(saida, "palavras.json")
    if os.path.exists(arq):
        shutil.copyfile(arq, os.path.join(saida, "palavras-anterior.json"))
    with open(arq, "w", encoding="utf-8", newline="\n") as f:
        json.dump(palavras, f, ensure_ascii=False, indent=1)
    with open(os.path.join(saida, "transcript.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write("<!-- %s | %s | %.3fs -->\n" % (a.modelo, disp, gasto))
        for fr in frases(palavras):
            f.write("[%s] %s\n" % (mmss(fr[0]["s"]), " ".join(p["w"] for p in fr)))
    print("Pronto: %d palavras, última termina em %.2f s (áudio: %.2f s). Levou %.0f s." % (len(palavras), palavras[-1]["e"] if palavras else 0, dur, gasto))
    print("Gravado em", os.path.relpath(saida, RAIZ))


if __name__ == "__main__":
    main()
