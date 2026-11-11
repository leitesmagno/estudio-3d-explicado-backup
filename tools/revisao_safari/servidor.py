#!/usr/bin/env python3
# Página de revisão dos vídeos prontos com caixa de anotação por vídeo.
# Abre em http://localhost:8777/  · grava em projetos/_anotacoes-videos.json e .md
import json, os, re, sys, html, urllib.parse, datetime
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

DOC = os.path.expanduser("~/Documents")
PASTAS = [("Lote do Drive", os.path.join(DOC, "TODOS OS VÍDEOS PARA O DRIVE")),
          ("Novo lote", os.path.join(DOC, "NOVO LOTE"))]
PROJ = os.path.expanduser("~/Estúdio 3D Explicado/projetos")
JS = os.path.join(PROJ, "_anotacoes-videos.json")
MD = os.path.join(PROJ, "_anotacoes-videos.md")


def lista():
    out = []
    for grupo, base in PASTAS:
        if not os.path.isdir(base):
            continue
        for nome in sorted(os.listdir(base), key=lambda s: s.lower()):
            p = os.path.join(base, nome)
            mp4 = os.path.join(p, nome + ".mp4")
            if os.path.isdir(p) and os.path.isfile(mp4):
                rel = os.path.relpath(p, DOC)
                out.append({"grupo": grupo, "nome": nome, "rel": rel})
    return out


def carrega():
    try:
        return json.load(open(JS))
    except Exception:
        return {}


def salva(d):
    tmp = JS + ".tmp"
    json.dump(d, open(tmp, "w"), ensure_ascii=False, indent=1)
    os.replace(tmp, JS)
    linhas = ["# Anotações do Magno nos vídeos (página de revisão no Safari)", "",
              "Status: PENDENTE = Claude ainda precisa tratar · FEITO = já ajustado.", ""]
    for nome, v in sorted(d.items()):
        for n in v.get("notas", []):
            linhas.append(f"- **{nome}** · {n['quando']} · {n['status']} · {n['texto']}")
    open(MD, "w").write("\n".join(linhas) + "\n")


def q(s):
    return urllib.parse.quote(s)


def pagina():
    notas = carrega()
    vids = lista()
    blocos, grupo_atual, i = [], None, 0
    for v in vids:
        if v["grupo"] != grupo_atual:
            grupo_atual = v["grupo"]
            blocos.append(f"<h2 class=grupo>{html.escape(grupo_atual)}</h2>")
        i += 1
        base = "/arq/" + q(v["rel"]) + "/" + q(v["nome"])
        hist = "".join(
            f"<li class='{ 'ok' if n['status']=='FEITO' else ''}'><b>{html.escape(n['quando'])}</b> · "
            f"{html.escape(n['status'])} · {html.escape(n['texto'])}</li>"
            for n in notas.get(v["nome"], {}).get("notas", []))
        blocos.append(f"""<section data-nome="{html.escape(v['nome'])}">
<h3>{i}. {html.escape(v['nome'])}</h3>
<video controls preload="none" playsinline src="{base}.mp4" poster="{base}%20-%20capa.jpg"></video>
<details><summary>Legenda do post</summary><pre class=leg data-src="{base}%20-%20legenda.txt">carregando…</pre></details>
<textarea placeholder="Anote aqui o que mudar (ex.: 1:12 a folha da Saúde cortou na direita)"></textarea>
<div class=bt><button class=env>OK, enviar para o Claude</button><button class=apr>Aprovado, sem ajustes</button></div>
<div class=msg></div><ul class=hist>{hist}</ul></section>""")
    return f"""<!doctype html><html lang=pt-BR><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1"><title>Revisão dos vídeos</title>
<style>
body{{background:#111;color:#eee;font-family:-apple-system,sans-serif;margin:0;padding:16px}}
h1{{font-size:20px}} .sub{{color:#aaa;font-size:14px;margin-top:-6px}}
h2.grupo{{grid-column:1/-1;margin:18px 0 0;font-size:17px;color:#7fd67f}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}}
section{{background:#1c1c1c;border-radius:10px;padding:10px}} h3{{font-size:15px;margin:2px 0 8px}}
video{{width:100%;aspect-ratio:9/16;background:#000;border-radius:6px}}
textarea{{width:100%;box-sizing:border-box;min-height:70px;margin-top:8px;background:#0c0c0c;color:#eee;border:1px solid #444;border-radius:6px;padding:8px;font:14px -apple-system,sans-serif}}
.bt{{display:flex;gap:6px;margin-top:6px}} button{{flex:1;padding:8px;border:0;border-radius:6px;font-weight:600;cursor:pointer}}
.env{{background:#2f7d32;color:#fff}} .apr{{background:#333;color:#ddd}}
.msg{{font-size:13px;color:#7fd67f;min-height:16px;margin-top:4px}}
.hist{{font-size:13px;color:#ccc;padding-left:18px;margin:4px 0 0}} .hist li.ok{{color:#7fd67f}}
details{{margin-top:6px;font-size:13px}} pre{{white-space:pre-wrap;color:#ccc;max-height:260px;overflow:auto}}
</style>
<h1>Revisão dos vídeos prontos ({len(vids)})</h1>
<p class=sub>Assista, escreva embaixo o que quer mudar e clique em <b>OK, enviar para o Claude</b>. A anotação chega direto para o Claude e fica guardada aqui embaixo do vídeo.</p>
<div class=g>{''.join(blocos)}</div>
<script>
document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',async()=>{{
 const p=d.querySelector('pre'); if(d.open&&p.textContent==='carregando…'){{
  try{{p.textContent=await (await fetch(p.dataset.src)).text()}}catch(e){{p.textContent='(sem legenda)'}} }} }}));
async function manda(sec,texto){{
 const m=sec.querySelector('.msg'); m.textContent='enviando…';
 try{{const r=await fetch('/nota',{{method:'POST',headers:{{'Content-Type':'application/json'}},
   body:JSON.stringify({{nome:sec.dataset.nome,texto}})}}); const j=await r.json();
  const li=document.createElement('li'); li.innerHTML='<b>'+j.quando+'</b> · PENDENTE · '; li.append(texto);
  sec.querySelector('.hist').append(li); sec.querySelector('textarea').value='';
  m.textContent='✔ Enviado para o Claude';}}catch(e){{m.style.color='#f77';m.textContent='Não enviou. O servidor está aberto?'}} }}
document.querySelectorAll('section').forEach(sec=>{{
 sec.querySelector('.env').onclick=()=>{{const t=sec.querySelector('textarea').value.trim();
  if(!t){{sec.querySelector('.msg').textContent='Escreva a anotação antes de enviar.';return}} manda(sec,t)}};
 sec.querySelector('.apr').onclick=()=>manda(sec,'APROVADO, sem ajustes');
 const v=sec.querySelector('video'); v.addEventListener('play',()=>document.querySelectorAll('video').forEach(o=>{{if(o!==v)o.pause()}}));
}});
</script></html>"""


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _envia(self, cod, corpo, tipo):
        self.send_response(cod)
        self.send_header("Content-Type", tipo)
        self.send_header("Content-Length", str(len(corpo)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(corpo)

    def do_GET(self):
        u = urllib.parse.urlparse(self.path).path
        if u in ("/", "/index.html"):
            return self._envia(200, pagina().encode(), "text/html; charset=utf-8")
        if u.startswith("/arq/"):
            rel = urllib.parse.unquote(u[5:])
            p = os.path.realpath(os.path.join(DOC, rel))
            if not p.startswith(os.path.realpath(DOC) + os.sep) or not os.path.isfile(p):
                return self._envia(404, b"nao achei", "text/plain")
            tipo = {"mp4": "video/mp4", "jpg": "image/jpeg", "txt": "text/plain; charset=utf-8"}.get(
                p.rsplit(".", 1)[-1].lower(), "application/octet-stream")
            tam = os.path.getsize(p)
            ini, fim, cod = 0, tam - 1, 200
            m = re.match(r"bytes=(\d*)-(\d*)", self.headers.get("Range", ""))
            if m:
                cod = 206
                if m.group(1):
                    ini = int(m.group(1))
                    if m.group(2):
                        fim = min(int(m.group(2)), tam - 1)
                else:
                    ini = max(0, tam - int(m.group(2)))
            n = fim - ini + 1
            self.send_response(cod)
            self.send_header("Content-Type", tipo)
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-Length", str(n))
            if cod == 206:
                self.send_header("Content-Range", f"bytes {ini}-{fim}/{tam}")
            self.end_headers()
            try:
                with open(p, "rb") as f:
                    f.seek(ini)
                    while n > 0:
                        b = f.read(min(1 << 20, n))
                        if not b:
                            break
                        self.wfile.write(b)
                        n -= len(b)
            except (BrokenPipeError, ConnectionResetError):
                pass
            return
        self._envia(404, b"nao achei", "text/plain")

    def do_POST(self):
        if self.path != "/nota":
            return self._envia(404, b"", "text/plain")
        d = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
        nome, texto = str(d.get("nome", ""))[:120], str(d.get("texto", "")).strip()[:4000]
        if not nome or not texto:
            return self._envia(400, b"{}", "application/json")
        quando = datetime.datetime.now().strftime("%d/%m %H:%M")
        tudo = carrega()
        tudo.setdefault(nome, {"notas": []})["notas"].append(
            {"quando": quando, "texto": texto, "status": "PENDENTE"})
        salva(tudo)
        print(f"NOTA {nome} · {texto}", flush=True)
        self._envia(200, json.dumps({"quando": quando}).encode(), "application/json")


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 8777), H).serve_forever()
