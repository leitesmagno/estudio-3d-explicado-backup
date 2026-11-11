import re, sys
from num2words import num2words
def fala(t):
    t=t.replace('@eumagnoleite','arroba eu magno leite').replace('R$','')
    def num(m):
        s=m.group(0); pct=s.endswith('%'); s=s.rstrip('%')
        if ',' in s:
            a,b=s.split(','); w=num2words(int(a),lang='pt_BR')+' vírgula '+num2words(int(b),lang='pt_BR')
        else: w=num2words(int(s.replace('.','')),lang='pt_BR')
        return w+(' por cento' if pct else '')
    return re.sub(r'\d+(?:[.,]\d+)?%?',num,t)
def silabas(t):
    return len(re.findall(r'[aeiouáéíóúâêôãõày]+',t.lower()))
base=open(sys.argv[1]).read(); seg_base=float(sys.argv[2])
spb=seg_base/silabas(fala(base))
for f in sys.argv[3:]:
    s=silabas(fala(open(f).read())); seg=s*spb
    print(f.split('/')[-1], s,'sílabas ·', f'{int(seg//60)} min {round(seg%60)} s')
