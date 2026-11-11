#!/usr/bin/env python3
"""Agente Gemini — trabalho braçal fora do Claude para economizar tokens.

A chave fica no Chaveiro do Mac (serviço gemini-agente). Nunca em arquivo.

Uso:
  python3 -I gemini_agente.py "pergunta" [arquivos...] [-o saida.md] [-m modelo] [--json]

Exemplos:
  # extrair tabela de um PDF do TCM
  python3 -I gemini_agente.py "Extraia a tabela de despesa por função, valores exatos, em CSV" balanco.pdf -o despesa.csv
  # resumir vários PDFs de uma vez
  python3 -I gemini_agente.py "Resuma cada documento em 5 linhas" *.pdf -o resumos.md
  # tarefa em lote: um pedido por arquivo, uma saída por arquivo
  python3 -I gemini_agente.py "Extraia o total da receita" pasta/*.pdf --lote -o saidas/

Só lê os arquivos dados e escreve a saída pedida. Não apaga, não publica, não roda comandos.
Tudo que sair daqui é rascunho: número que vai para vídeo/site precisa ser conferido no PDF.
"""
import argparse, base64, json, mimetypes, os, subprocess, sys, time, urllib.request, urllib.error

API = "https://generativelanguage.googleapis.com"
MODELO_PADRAO = "gemini-flash-latest"
LIMITE_INLINE = 15 * 1024 * 1024  # acima disso usa a File API

SISTEMA = (
    "Você é um assistente de levantamento de contas públicas. Responda sempre em português do Brasil. "
    "Copie números exatamente como estão no documento, sem arredondar. "
    "Para cada número, diga a página de onde saiu. Se algo não estiver no documento, diga 'não consta' — nunca invente. "
    "Tom informativo, sem acusações."
)


def chave():
    k = os.environ.get("GEMINI_KEY")
    if k:
        return k
    return subprocess.run(["security", "find-generic-password", "-s", "gemini-agente", "-w"],
                          capture_output=True, text=True, check=True).stdout.strip()


def pedir(url, dados=None, cabecalhos=None, metodo=None, tentativas=4):
    for i in range(tentativas):
        req = urllib.request.Request(url, data=dados, headers=cabecalhos or {}, method=metodo)
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                return r.read(), dict(r.headers)
        except urllib.error.HTTPError as e:
            corpo = e.read().decode(errors="replace")
            if e.code in (429, 500, 503) and i < tentativas - 1:
                time.sleep(10 * (i + 1)); continue
            sys.exit(f"Erro {e.code} da API: {corpo[:500]}")


def subir_arquivo(caminho, mime, k):
    tamanho = os.path.getsize(caminho)
    _, h = pedir(f"{API}/upload/v1beta/files?key={k}",
                 json.dumps({"file": {"display_name": os.path.basename(caminho)}}).encode(),
                 {"X-Goog-Upload-Protocol": "resumable", "X-Goog-Upload-Command": "start",
                  "X-Goog-Upload-Header-Content-Length": str(tamanho),
                  "X-Goog-Upload-Header-Content-Type": mime, "Content-Type": "application/json"}, "POST")
    url_up = {kk.lower(): v for kk, v in h.items()}["x-goog-upload-url"]
    with open(caminho, "rb") as f:
        corpo, _ = pedir(url_up, f.read(), {"X-Goog-Upload-Offset": "0", "X-Goog-Upload-Command": "upload, finalize"}, "POST")
    info = json.loads(corpo)["file"]
    while info.get("state") == "PROCESSING":
        time.sleep(3)
        info = json.loads(pedir(f"{API}/v1beta/{info['name']}?key={k}")[0])
    return {"file_data": {"mime_type": mime, "file_uri": info["uri"]}}


def parte_arquivo(caminho, k):
    mime = mimetypes.guess_type(caminho)[0] or "text/plain"
    if mime.startswith("text/") or caminho.endswith((".md", ".csv", ".json", ".txt")):
        with open(caminho, encoding="utf-8", errors="replace") as f:
            return {"text": f"\n--- arquivo: {os.path.basename(caminho)} ---\n{f.read()}"}
    if os.path.getsize(caminho) > LIMITE_INLINE:
        return subir_arquivo(caminho, mime, k)
    with open(caminho, "rb") as f:
        return {"inline_data": {"mime_type": mime, "data": base64.b64encode(f.read()).decode()}}


def gerar(pergunta, arquivos, modelo, k, como_json=False):
    partes = [parte_arquivo(a, k) for a in arquivos] + [{"text": pergunta}]
    corpo = {"system_instruction": {"parts": [{"text": SISTEMA}]},
             "contents": [{"role": "user", "parts": partes}],
             "generationConfig": {"temperature": 0.1}}
    if como_json:
        corpo["generationConfig"]["response_mime_type"] = "application/json"
    resp, _ = pedir(f"{API}/v1beta/models/{modelo}:generateContent?key={k}",
                    json.dumps(corpo).encode(), {"Content-Type": "application/json"}, "POST")
    d = json.loads(resp)
    try:
        texto = "".join(p.get("text", "") for p in d["candidates"][0]["content"]["parts"])
    except (KeyError, IndexError):
        sys.exit("Resposta sem texto: " + json.dumps(d)[:500])
    u = d.get("usageMetadata", {})
    print(f"[gemini {modelo}] entrada {u.get('promptTokenCount')} / saída {u.get('candidatesTokenCount')} tokens", file=sys.stderr)
    return texto


def main():
    ap = argparse.ArgumentParser(description="Agente Gemini para trabalho braçal")
    ap.add_argument("pergunta")
    ap.add_argument("arquivos", nargs="*")
    ap.add_argument("-o", "--saida")
    ap.add_argument("-m", "--modelo", default=MODELO_PADRAO)
    ap.add_argument("--json", action="store_true", help="resposta em JSON")
    ap.add_argument("--lote", action="store_true", help="um pedido por arquivo; -o é uma pasta")
    a = ap.parse_args()
    k = chave()

    if a.lote:
        pasta = a.saida or "saidas_gemini"
        os.makedirs(pasta, exist_ok=True)
        ext = ".json" if a.json else ".md"
        for arq in a.arquivos:
            destino = os.path.join(pasta, os.path.splitext(os.path.basename(arq))[0] + ext)
            if os.path.exists(destino):
                print(f"pulando (já existe): {destino}", file=sys.stderr); continue
            with open(destino, "w", encoding="utf-8") as f:
                f.write(gerar(a.pergunta, [arq], a.modelo, k, a.json))
            print(f"ok: {destino}", file=sys.stderr)
        return

    texto = gerar(a.pergunta, a.arquivos, a.modelo, k, a.json)
    if a.saida:
        with open(a.saida, "w", encoding="utf-8") as f:
            f.write(texto)
        print(f"salvo em {a.saida}", file=sys.stderr)
    else:
        print(texto)


if __name__ == "__main__":
    main()
