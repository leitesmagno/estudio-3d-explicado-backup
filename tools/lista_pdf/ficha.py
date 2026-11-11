# Gera a ficha de uma cidade a partir de parâmetros simples (usado nos vídeos já feitos).
# uso: python3 -I ficha.py params.json  -> grava ficha.json e config.json em <D>/saida/folha-pdf/ e põe na fila
import json, sys, os, subprocess, shutil
A = json.load(open(sys.argv[1]))
D = A["D"]; out = os.path.join(D, "saida/folha-pdf"); os.makedirs(out, exist_ok=True)
F = dict(video=A["video"], saida=os.path.expanduser("~/Documents/PARA O DRIVE - com folha PDF/") + A["nome"] + ".mp4",
         palavras=A["palavras"], tmp=os.path.join(out, "tmp"), anos=[])
for y in A["anos"]:
    F["anos"].append(dict(ano=y["ano"], receita_txt=os.path.join(D, "documentos_tcm", y["txt"]), receita_total=y["rt"],
        receita_rodape=y["rr"], despesa_total=y["dt"], despesa=y["desp"], despesa_rodape=y["dr"],
        receita_de=y["a"][0], despesa_de=y["a"][1], despesa_ate=y["a"][2], **({"rotulo_ajuste": y["aj"]} if "aj" in y else {})))
json.dump(F, open(os.path.join(out, "ficha.json"), "w"), ensure_ascii=False, indent=1)
r = subprocess.run(["python3", "-I", os.path.join(os.path.dirname(os.path.abspath(__file__)), "montar.py"),
                    os.path.join(out, "ficha.json"), os.path.join(out, "config.json")], capture_output=True, text=True)
print(r.stdout, r.stderr)
if r.returncode == 0 and "NEGATIVO" not in r.stdout and A.get("fila"):
    q = os.path.expanduser("~/Documents/PARA O DRIVE - com folha PDF/_fila/")
    shutil.copy(os.path.join(out, "config.json"), q + A["fila"] + ".json"); print("na fila:", A["fila"])
