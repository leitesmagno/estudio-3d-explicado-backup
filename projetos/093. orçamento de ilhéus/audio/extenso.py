import re,sys
U=['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove']
D=['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa']
C=['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos']
def ate999(n):
    if n==100: return 'cem'
    p=[]
    if n>=100: p.append(C[n//100]); n%=100
    if n>=20: p.append(D[n//10]+('' if n%10==0 else ' e '+U[n%10]))
    elif n>0: p.append(U[n])
    return ' e '.join(p)
def ext(n):
    if n<1000: return ate999(n)
    m,r=divmod(n,1000)
    s=('mil' if m==1 else ate999(m)+' mil')
    if r==0: return s
    return s+(' e ' if (r<100 or r%100==0) else ' ')+ate999(r)
t=open(sys.argv[1]).read()
t=t.replace('@eumagnoleite','arroba eu magno leite')
t=re.sub(r'\b(\d+)\b',lambda m: ext(int(m.group(1))),t)
t=t.replace('um milhão','um milhão').replace('dois milhões','dois milhões')
open(sys.argv[2],'w').write(t); print(t)
