# Prepara a grade de agendamento do Instagram: legenda do post (hashtags = cidade + #MagnoLeiteExplica) e comentário fixado separados.
import os, re, sys
DOC=os.path.expanduser("~/Documents"); OUT=os.path.join(DOC,"AGENDAMENTO INSTAGRAM"); os.makedirs(OUT,exist_ok=True)
TAG="#MagnoLeiteExplica"
G=[("Dom 09/11",[("20:00","CAMACAN"),("21:30","MATA DE SÃO JOÃO")]),
("Seg 10/11",[("07:00","DÁRIO MEIRA"),("09:30","ALMADINA"),("11:30","ITACARÉ"),("12:30","POTIRAGUÁ"),("15:00","ITAMBÉ"),("18:00","ITAMARAJU"),("20:00","SEABRA"),("21:30","LAURO DE FREITAS")]),
("Ter 11/11",[("07:00","BARRO PRETO"),("09:30","CÂNDIDO SALES"),("11:30","CAIRU"),("12:30","MACAÚBAS"),("15:00","URUÇUCA"),("18:00","BOM JESUS DA LAPA"),("20:00","VALENÇA"),("21:30","BARREIRAS")]),
("Qua 12/11",[("07:00","CARAVELAS"),("09:30","PARAMIRIM"),("11:30","RIO DE CONTAS"),("12:30","ITABELA"),("15:00","GANDU"),("18:00","CAETITÉ"),("20:00","SANTO ANTÔNIO DE JESUS"),("21:30","LUÍS EDUARDO MAGALHÃES")]),
("Qui 13/11",[("07:00","ITUBERÁ"),("11:30","MARACÁS"),("12:30","MUCURI"),("18:00","NOVA VIÇOSA")])]
def pasta(n):
    for b in ("TODOS OS VÍDEOS PARA O DRIVE","NOVO LOTE"):
        p=os.path.join(DOC,b,n)
        if os.path.isdir(p): return p
    sys.exit("faltou "+n)
md=["# Agendamento no Instagram (Meta Business Suite)","","Hashtags: só a da cidade + "+TAG+". Comentário fixado: colar e fixar depois que o post sair.","","| # | Dia | Hora | Cidade | Status |","|---|---|---|---|---|"]
i=0
for dia,itens in G:
    for h,n in itens:
        i+=1; p=pasta(n); t=open(os.path.join(p,n+" - legenda.txt")).read()
        post,_,fix=t.partition("\n---\n")
        linhas=post.rstrip().split("\n")
        k=max(j for j,l in enumerate(linhas) if l.strip().startswith("#"))
        cid=linhas[k].split()[0]
        linhas[k]=cid+" "+TAG
        nn=f"{i:02d}"
        open(os.path.join(OUT,f"{nn} - {n} - legenda do post.txt"),"w").write("\n".join(linhas)+"\n")
        open(os.path.join(OUT,f"{nn} - {n} - comentário fixado.txt"),"w").write(re.sub(r"^Comentário fixado.*\n","",fix.strip()+"\n"))
        md.append(f"| {nn} | {dia} | {h} | {n} | a agendar |")
open(os.path.join(OUT,"GRADE.md"),"w").write("\n".join(md)+"\n"); print(i,"itens")
