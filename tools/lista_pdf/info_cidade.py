# Mostra o que é preciso para montar as folhas de um vídeo já feito.
# uso: python3 -I info_cidade.py "<pasta do projeto>" "<pasta RECEITAS-DESPESAS>"
import sys, os, re, json, subprocess, glob
P, D = sys.argv[1], sys.argv[2]
T = os.path.join(os.path.dirname(__file__), "lista_pdf.py")
print("=== ROTEIRO")
r = open(os.path.join(P, "audio/roteiro-falado.txt")).read()
print(r[:2600])
print("\n=== FONTES (totais e setores)")
f = open(os.path.join(P, "audio/fontes.md")).read().split("\n")
for l in f:
    if re.search(r"(arrecad|gastou|Totais|SUBTOTAL|^- [A-ZÁÉÍÓÚÂÊÔÃÕÇ][^:]{2,40} \(|setor)", l, re.I):
        print(l[:260])
print("\n=== RECEITA (PCMGE016 da Prefeitura)")
for t in sorted(glob.glob(os.path.join(D, "documentos_tcm/*PCMGE016.txt"))):
    o = subprocess.run(["python3", "-I", T, "receita", t, "x"], capture_output=True, text=True).stdout
    try:
        j = json.loads(o); outras = j["linhas"][-1][1]
        print(f"{os.path.basename(t):40s} total {j['total']:>16,.2f}  outras {outras:>14,.2f}  códigos {j['codigos_achados']}")
    except Exception as e:
        print(os.path.basename(t), "ERRO", o[:200])
print("\n=== SETORES (arquivos)")
for s in glob.glob(os.path.join(D, "saida/*setor*")) + glob.glob(os.path.join(D, "saida/*funcao*")):
    print(s); print(open(s).read()[:1500])
