"""Refaz no modelo novo (cidade em destaque + mapa) a capa que o Braniac entregou.
Uso: python3 scripts/capa_da_capa.py "Cidade" capa-antiga.jpg saida.jpg [uf]
Lê as 4 linhas de texto da capa antiga (OCR do macOS), monta o fundo com a maquete da parte de baixo dela e chama capa_nova.py."""
import subprocess, sys, tempfile, os
from pathlib import Path
from PIL import Image
AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import capa_nova

def linhas_da_capa(capa):
    out = subprocess.run([str(AQUI / 'ocr_capa'), str(capa)], capture_output=True, text=True).stdout.splitlines()
    L = []
    for l in out:
        y, _, t = l.partition(' ')
        if y.isdigit() and 360 <= int(y) <= 1000 and 'Magno' not in t and t.strip(): L.append(t.strip())
    return L[:4]

def fundo_da_capa(capa, destino):
    im = Image.open(capa).convert('RGB')
    base = im.crop((0, 1180, 1080, 1920)).resize((1242, 851))   # ampliada 15% para a maquete chegar ao pé da capa
    base = base.crop((81, 0, 1161, 851))
    cor = im.getpixel((10, 1150))
    tela = Image.new('RGB', (1080, 1920), cor)
    tela.paste(base, (0, 330))
    tela.save(destino, quality=95)

def main(cidade, capa, saida, uf='ba'):
    L = linhas_da_capa(capa)
    if len(L) < 2: raise SystemExit(f'não li o texto da capa: {L}')
    with tempfile.TemporaryDirectory() as t:
        f = os.path.join(t, 'fundo.jpg'); fundo_da_capa(capa, f)
        capa_nova.main(cidade, '|'.join(L), f, saida, uf)

if __name__ == '__main__': main(*sys.argv[1:])
