"""Transcreve a narração palavra por palavra (faster-whisper) para sincronizar o vídeo.

Uso:
    python tools/transcrever.py "projetos/NNN. nome" [--modelo large-v3-turbo] [--idioma pt] [--dispositivo auto]

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


def main():
    ap = argparse.ArgumentParser(description="Transcreve a narração com tempo de cada palavra.")
    ap.add_argument("pasta", help='pasta do projeto, ex.: "projetos/001. escala 6x1"')
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

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit("faster-whisper não está instalado. Rode: pip install -r tools/requirements.txt (no .venv do Estúdio).")

    dica = None
    roteiro = os.path.join(pasta, "audio", "roteiro-falado.txt")
    if not a.sem_dica and os.path.exists(roteiro):
        with open(roteiro, encoding="utf-8") as f:
            dica = " ".join(f.read().split())[:600]

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
