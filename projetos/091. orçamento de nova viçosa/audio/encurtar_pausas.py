import re,subprocess,sys
src,out,keep=sys.argv[1],sys.argv[2],float(sys.argv[3])
log=subprocess.run(['ffmpeg','-i',src,'-af','silencedetect=noise=-40dB:d=0.3','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',log)]; en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',log)]
dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',src],capture_output=True,text=True).stdout)
segs=[];cur=0.0
for s,e in zip(st,en):
    if s<0.05: cur=max(cur,e-0.05); continue   # silêncio do começo
    if e>dur-0.05: segs.append((cur,s+0.15)); cur=None; break
    segs.append((cur,s+keep/2)); cur=e-keep/2
if cur is not None: segs.append((cur,dur))
f=''.join(f'[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[s{i}];' for i,(a,b) in enumerate(segs))
f+=''.join(f'[s{i}]' for i in range(len(segs)))+f'concat=n={len(segs)}:v=0:a=1[o]'
subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-filter_complex',f,'-map','[o]','-ac','1','-ar','44100',out],check=True)
print(len(segs),'trechos')
