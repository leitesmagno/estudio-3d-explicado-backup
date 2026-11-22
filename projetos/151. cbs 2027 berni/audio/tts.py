import os,sys,json,base64,urllib.request
key=os.environ['GK']; txt=open(sys.argv[1]).read(); out=sys.argv[2]; os.makedirs(out,exist_ok=True)
pars=[p.strip() for p in txt.split('\n\n') if p.strip()]
for i,p in enumerate(pars,1):
    body={"input":{"text":p},"voice":{"languageCode":"pt-BR","name":"pt-BR-Chirp3-HD-Algenib"},"audioConfig":{"audioEncoding":"LINEAR16","sampleRateHertz":24000,"speakingRate":1.3}}
    req=urllib.request.Request("https://texttospeech.googleapis.com/v1/text:synthesize?key="+key,data=json.dumps(body).encode(),headers={"Content-Type":"application/json"})
    r=json.load(urllib.request.urlopen(req,timeout=120))
    open(os.path.join(out,'p%02d.wav'%i),'wb').write(base64.b64decode(r['audioContent'])); print('ok',i,len(p))
