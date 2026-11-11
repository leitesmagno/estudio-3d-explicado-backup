#!/usr/bin/env python3
# Recebe documentos mandados pela página do e-TCM (fetch POST), sem janela "Salvar como".
#
# 1) /salva  -> grava no Mac (PDFs dos 3 anos que o vídeo usa):
#    fetch('http://127.0.0.1:8778/salva?pasta=NAZARE&nome=NAZ_2024-12_PCMGE016.pdf',{method:'POST',body:blob})
#    vai para ~/Documents/RECEITAS-DESPESAS-<PASTA>/documentos_tcm/<nome>
#
# 2) /nuvem  -> COFRE: manda direto para a nuvem do site (download completo 2016 até hoje):
#    fetch('http://127.0.0.1:8778/nuvem?pasta=NAZARE&nome=2018-05_PCMGE056.pdf',{method:'POST',body:blob})
#    fica numa fila em ~/Documents/SITE-EUMAGNOLEITE/.cofre_fila, sobe para o R2 em cofre/<cidade>/<ano>/...,
#    é anotado em ~/Documents/SITE-EUMAGNOLEITE/dados/cofre.jsonl (lista fixa, o site nunca apaga)
#    e só então a cópia da fila é apagada. Resposta 503 = fila cheia, espere uns segundos e mande de novo.
#    GET /nuvem/status -> {"fila":..,"enviados":..,"falhas":..}
import os, re, sys, json, time, hashlib, threading, subprocess, urllib.parse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

DOC = os.path.expanduser("~/Documents")
SITE = os.path.join(DOC, "SITE-EUMAGNOLEITE")
sys.path.insert(0, os.path.join(SITE, "build"))
from acervo import slug, safe, ALIAS, IBGE, BUCKET, FORA, dono  # mesmas regras do site

FILA = os.path.join(SITE, ".cofre_fila")
LISTA = os.path.join(SITE, "dados", "cofre.jsonl")
FORA_TXT = os.path.join(SITE, "dados", "cofre_fora.txt")
LIMITE_FILA = 400 * 1024 * 1024        # acima disso responde 503 (espera)
ENVIOS = 2                              # uploads ao mesmo tempo (cada um ~170 MB de memória)
trava = threading.Lock()
estado = {"enviados": 0, "falhas": 0, "repetidos": 0, "outra_cidade": 0}


def shas_na_lista():
    s = set()
    if os.path.exists(LISTA):
        for l in open(LISTA, encoding="utf-8"):
            try: s.add(json.loads(l)["sha"])
            except Exception: pass
    return s


JA = shas_na_lista()


def tamanho_fila():
    t = 0
    for r, _, fs in os.walk(FILA):
        for f in fs: t += os.path.getsize(os.path.join(r, f))
    return t


def cidade_de(pasta):
    return ALIAS.get(pasta, slug(pasta))


def envia_um(caminho):
    d = os.path.dirname(caminho); confia = os.path.basename(d) == "_confia"   # veio do robô (unidade certa), não precisa checar o cabeçalho
    pasta = os.path.basename(os.path.dirname(d) if confia else d); nome = os.path.basename(caminho)
    cid = cidade_de(pasta)
    dados = open(caminho, "rb").read(); sha = hashlib.sha256(dados).hexdigest()
    with trava:
        if sha in JA:
            os.remove(caminho); estado["repetidos"] += 1; return
    if nome.lower().endswith(".pdf") and not confia:
        dn = dono(caminho, {})
        if dn and dn in IBGE and dn != cid:
            with trava:
                open(FORA_TXT, "a").write(f"{cid} <- arquivo de {dn}: {nome}\n"); estado["outra_cidade"] += 1
            os.remove(caminho); return
    m = re.search(r"(20[12]\d)[-_]?(\d{2})?", nome); ano = m.group(1) if m else ""
    mes = m.group(2) if m and m.group(2) and 1 <= int(m.group(2)) <= 13 else ""
    cod = (re.search(r"PC[A-Z]{3}\d{3}", nome, re.I) or [""])[0].upper()
    key = f"cofre/{cid}/{ano or 'outros'}/{sha[:8]}-{safe(nome)}"
    tipo_ct = "application/pdf" if nome.lower().endswith(".pdf") else "application/octet-stream"
    r = subprocess.run(["/opt/homebrew/bin/npx", "--yes", "wrangler@3", "r2", "object", "put", f"{BUCKET}/{key}",
                        "--file", caminho, "--content-type", tipo_ct],
                       capture_output=True, text=True, env={**os.environ, "PATH": "/opt/homebrew/bin:/usr/bin:/bin"})
    if r.returncode != 0:
        with trava: estado["falhas"] += 1
        print(f"FALHA {key}: {(r.stderr or r.stdout)[-300:]}", flush=True)
        return
    reg = dict(cid=cid, a=nome, ano=ano, mes=mes, cod=cod, key=key, sha=sha, kb=len(dados) // 1024,
               quando=time.strftime("%Y-%m-%d %H:%M"))
    with trava:
        open(LISTA, "a", encoding="utf-8").write(json.dumps(reg, ensure_ascii=False) + "\n")
        JA.add(sha); estado["enviados"] += 1
    os.remove(caminho)


def trabalhador():
    em_uso = set()
    while True:
        prox = None
        with trava:
            for r, _, fs in os.walk(FILA):
                for f in sorted(fs):
                    p = os.path.join(r, f)
                    if f.startswith(".") or p in trabalhador.pegos: continue
                    prox = p; trabalhador.pegos.add(p); break
                if prox: break
        if not prox:
            time.sleep(3); continue
        try:
            envia_um(prox)
        except Exception as e:
            print("ERRO", prox, e, flush=True)
        finally:
            with trava: trabalhador.pegos.discard(prox)
            if os.path.exists(prox): time.sleep(20)   # falhou: espera antes de tentar de novo
trabalhador.pegos = set()


class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def _cab(self, cod):
        self.send_response(cod)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Content-Type", "application/json")

    def _json(self, cod, d):
        self._cab(cod); self.end_headers(); self.wfile.write(json.dumps(d, ensure_ascii=False).encode())

    def do_OPTIONS(self):
        self._cab(204); self.end_headers()

    def do_GET(self):
        u = urllib.parse.urlparse(self.path); q = urllib.parse.parse_qs(u.query)
        if u.path == "/cofre.js":
            corpo = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "cofre_pagina.js"), "rb").read()
            self._cab(200); self.send_header("Content-Type", "text/javascript; charset=utf-8"); self.end_headers(); self.wfile.write(corpo); return
        if u.path == "/fila_balancos.json":
            corpo = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "fila_balancos.json"), "rb").read()
            self._cab(200); self.end_headers(); self.wfile.write(corpo); return
        if u.path == "/existe":
            pasta = re.sub(r"[^A-Z0-9_-]", "", (q.get("pasta", [""])[0]).upper()); nome = os.path.basename(q.get("nome", [""])[0])
            return self._json(200, {"existe": os.path.exists(os.path.join(DOC, f"RECEITAS-DESPESAS-{pasta}", "documentos_tcm", nome))})
        if u.path == "/nuvem/feitos":
            pasta = re.sub(r"[^A-Z0-9_-]", "", (q.get("pasta", [""])[0]).upper()); cid = cidade_de(pasta); nomes = []
            if os.path.exists(LISTA):
                for l in open(LISTA, encoding="utf-8"):
                    try:
                        r = json.loads(l)
                        if r["cid"] == cid: nomes.append(r["a"])
                    except Exception: pass
            for r, _, fs in os.walk(os.path.join(FILA, pasta)):
                nomes += [f for f in fs if not f.startswith(".")]
            return self._json(200, nomes)
        if u.path == "/nuvem/status":
            n = sum(len([f for f in fs if not f.startswith(".")]) for _, _, fs in os.walk(FILA))
            return self._json(200, dict(estado, fila=n, fila_mb=tamanho_fila() // 1048576, na_lista=len(JA)))
        self._json(404, {"erro": "?"})

    def do_POST(self):
        u = urllib.parse.urlparse(self.path); q = urllib.parse.parse_qs(u.query)
        if u.path == "/prestacoes":
            # lista oficial de prestações mensais da Prefeitura (pedido do site): grava dados/prestacoes-etcm/<slug>.json
            cid = re.sub(r"[^a-z0-9-]", "", (q.get("cidade", [""])[0]).lower())
            try: d = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
            except Exception: return self._json(400, {"erro": "json inválido"})
            if not cid or cid not in IBGE or not isinstance(d.get("mensais"), list) or not d["mensais"]:
                return self._json(400, {"erro": "cidade fora do IBGE ou lista vazia"})
            pasta_p = os.path.join(SITE, "dados", "prestacoes-etcm"); os.makedirs(pasta_p, exist_ok=True)
            tmp = os.path.join(pasta_p, "." + cid + ".tmp")
            json.dump(d, open(tmp, "w", encoding="utf-8"), ensure_ascii=False, indent=1); os.replace(tmp, os.path.join(pasta_p, cid + ".json"))
            return self._json(200, {"ok": True, "arquivo": f"dados/prestacoes-etcm/{cid}.json", "linhas": len(d["mensais"])})
        if u.path == "/pendencia":
            t = self.rfile.read(int(self.headers.get("Content-Length", 0)))[:2000].decode("utf-8", "replace").replace("\n", " ")
            open(os.path.expanduser("~/Estúdio 3D Explicado/projetos/_pendencias-tcm.md"), "a", encoding="utf-8").write(f"- {time.strftime('%d/%m/%Y %H:%M')} (baixador do Chrome) {t}\n")
            return self._json(200, {"ok": True})
        if u.path == "/nuvem/log":
            t = self.rfile.read(int(self.headers.get("Content-Length", 0)))[:2000].decode("utf-8", "replace").replace("\n", " ")
            open(os.path.join(SITE, ".cache", "cofre.log"), "a", encoding="utf-8").write(t + "\n")
            return self._json(200, {"ok": True})
        pasta = re.sub(r"[^A-Z0-9_-]", "", (q.get("pasta", [""])[0]).upper())
        nome = os.path.basename(q.get("nome", [""])[0])
        if u.path not in ("/salva", "/nuvem") or not pasta or not re.fullmatch(r"[\w.() -]+\.(pdf|PDF|txt|html|json|xlsx?|csv)", nome):
            return self._json(400, {"erro": "pasta ou nome"})
        if u.path == "/nuvem":
            if pasta in FORA or cidade_de(pasta) not in IBGE:
                return self._json(400, {"erro": f"pasta {pasta} não é município do IBGE"})
            if tamanho_fila() > LIMITE_FILA:
                return self._json(503, {"erro": "fila cheia, espere e mande de novo"})
        n = int(self.headers.get("Content-Length", 0))
        dados = self.rfile.read(n)
        if u.path == "/salva":
            dest = os.path.join(DOC, f"RECEITAS-DESPESAS-{pasta}", "documentos_tcm")
        else:
            dest = os.path.join(FILA, pasta, "_confia") if q.get("confia", [""])[0] == "1" else os.path.join(FILA, pasta)
        os.makedirs(dest, exist_ok=True)
        p = os.path.join(dest, nome)
        if os.path.exists(p) and os.path.getsize(p) != len(dados):
            base, ext = os.path.splitext(p); i = 2
            while os.path.exists(f"{base}_{i}{ext}"): i += 1
            p = f"{base}_{i}{ext}"
        tmp = os.path.join(dest, "." + os.path.basename(p) + ".parcial")
        open(tmp, "wb").write(dados); os.replace(tmp, p)
        if u.path == "/salva" and q.get("txt", [""])[0] == "1" and p.lower().endswith(".pdf"):
            r = subprocess.run(["/usr/bin/python3", os.path.join(os.path.dirname(os.path.abspath(__file__)), "extrai_txt.py"), p], capture_output=True, text=True)
            if r.returncode: print("txt falhou", p, r.stderr[-300:], flush=True)
        self._json(200, {"ok": True, "arquivo": p, "bytes": len(dados), "destino": "nuvem" if u.path == "/nuvem" else "mac"})


if __name__ == "__main__":
    os.makedirs(FILA, exist_ok=True)
    for _ in range(ENVIOS):
        threading.Thread(target=trabalhador, daemon=True).start()
    ThreadingHTTPServer(("127.0.0.1", 8778), H).serve_forever()
