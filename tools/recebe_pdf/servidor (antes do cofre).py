#!/usr/bin/env python3
# Recebe PDFs mandados pela página do e-TCM (fetch POST) e grava direto na pasta da cidade,
# sem janela "Salvar como". Uso na página:
#   fetch('http://127.0.0.1:8778/salva?pasta=NAZARE&nome=NAZ_2024-12_PCMGE016.pdf',{method:'POST',body:blob})
# Grava em ~/Documents/RECEITAS-DESPESAS-<PASTA>/documentos_tcm/<nome>
import os, re, json, urllib.parse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
DOC = os.path.expanduser("~/Documents")
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _cab(self, cod):
        self.send_response(cod)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Content-Type", "application/json")
    def do_OPTIONS(self):
        self._cab(204); self.end_headers()
    def do_POST(self):
        u = urllib.parse.urlparse(self.path); q = urllib.parse.parse_qs(u.query)
        pasta = re.sub(r"[^A-Z0-9_-]", "", (q.get("pasta", [""])[0]).upper())
        nome = os.path.basename(q.get("nome", [""])[0])
        if u.path != "/salva" or not pasta or not re.fullmatch(r"[\w.() -]+\.(pdf|PDF|txt|html|json|xlsx?|csv)", nome):
            self._cab(400); self.end_headers(); self.wfile.write(b'{"erro":"pasta ou nome"}'); return
        n = int(self.headers.get("Content-Length", 0))
        dados = self.rfile.read(n)
        dest = os.path.join(DOC, f"RECEITAS-DESPESAS-{pasta}", "documentos_tcm")
        os.makedirs(dest, exist_ok=True)
        p = os.path.join(dest, nome)
        if os.path.exists(p) and os.path.getsize(p) != len(dados):
            base, ext = os.path.splitext(p); i = 2
            while os.path.exists(f"{base}_{i}{ext}"): i += 1
            p = f"{base}_{i}{ext}"
        open(p, "wb").write(dados)
        self._cab(200); self.end_headers()
        self.wfile.write(json.dumps({"ok": True, "arquivo": p, "bytes": len(dados)}).encode())
if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 8778), H).serve_forever()
