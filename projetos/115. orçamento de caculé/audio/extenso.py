import re,sys
U=['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove']
D=['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa']
C=['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos']
def ate999(n):
    if n<20: return U[n]
    if n<100: d,u=divmod(n,10); return D[d]+(' e '+U[u] if u else '')
    if n==100: return 'cem'
    c,r=divmod(n,100); return C[c]+(' e '+ate999(r) if r else '')
def ext(n):
    if n<1000: return ate999(n)
    m,r=divmod(n,1000); a='mil' if m==1 else ate999(m)+' mil'
    if not r: return a
    return a+(' e ' if r<100 or r%100==0 else ' ')+ate999(r)
s=open(sys.argv[1]).read()
s=s.replace('@eumagnoleite','arroba eu magno leite')
s=re.sub(r'\b(\d+) milhão\b',lambda m: ('um' if m.group(1)=='1' else ext(int(m.group(1))))+' milhão',s)
s=re.sub(r'\d+',lambda m: ext(int(m.group(0))),s)
open(sys.argv[2],'w').write(s)
