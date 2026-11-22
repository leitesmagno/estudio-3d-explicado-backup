(()=>{let fr=document.getElementById('__cofre_moldura'); if(!fr){fr=document.createElement('iframe'); fr.id='__cofre_moldura'; fr.style.cssText='position:fixed;inset:0;width:100%;height:100%;border:0;z-index:99999;background:#fff'; document.body.appendChild(fr);}})();
window.etcm = ((MUN, PASTA0) => {
 const RX='http://127.0.0.1:8778', PASTA=PASTA0, F='consultaPublicaTabPanel:consultaPublicaPCSearchForm:', PRE='widget_consultaPublicaTabPanel_consultaPublicaPCSearchForm_';
 const fr=()=>document.getElementById('__cofre_moldura'); const W=()=>fr().contentWindow, D=()=>fr().contentDocument;
 const TW=new Worker(URL.createObjectURL(new Blob(['onmessage=e=>setTimeout(()=>postMessage(e.data.id),e.data.ms)']))); const esp={}; let nid=0; TW.onmessage=e=>{esp[e.data](); delete esp[e.data];};
 const sleep=ms=>new Promise(r=>{const id=++nid; esp[id]=r; TW.postMessage({id,ms});});
 const st={rodando:false,parar:false,log:[],salvos:[],falhas:[]}; const log=t=>st.log.push(new Date().toLocaleTimeString('pt-BR')+' '+t);
 const norm=s=>(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/\s+/g,' ').trim();
 const busy=()=>{ try{ const w=W(); if(w.jQuery){ w.jQuery.fx.off=true; if(w.jQuery.active>0) return true; const q=w.PrimeFaces&&w.PrimeFaces.ajax&&w.PrimeFaces.ajax.Queue; if(q&&q.requests&&q.requests.length) return true; const c=D().getElementById('modalStatus_container'); if(c) c.style.display='none'; const m=D().querySelector('.ui-widget-overlay'); if(m) m.style.display='none'; return false; } return true; }catch(e){return true;} };
 async function ate(cond,s){ for(let i=0;i<s*2;i++){ if(st.parar) throw new Error('parado'); try{ if(cond()) return true; }catch(e){} await sleep(500);} return false; }
 async function calma(){ await sleep(1200); await ate(()=>!busy(),400); await sleep(800); }
 async function recarregar(){ const t=Date.now(); fr().src='https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam?t='+t; const ok=await ate(()=>W().location.href.includes('t='+t)&&D().readyState==='complete'&&D().getElementById(F+'municipio_input')&&W().PrimeFaces,90); await sleep(2000); return ok; }
 const val=id=>D().getElementById(F+id).value;
 const opcoes=id=>[...D().getElementById(F+id).options].map(o=>({v:o.value,t:o.text.trim()}));
 async function sel(w,id,v){ for(let k=0;k<4;k++){ W().PrimeFaces.widgets[PRE+w].selectValue(v); await calma(); await sleep(1500); if(val(id)==v) return; } throw new Error('não selecionou '+w); }
 async function info(){
  if(!D()||!D().getElementById(F+'municipio_input')) await recarregar();
  const mun=opcoes('municipio_input').find(m=>norm(m.t)===norm(MUN));
  await sel('municipio','municipio_input',mun.v);
  await ate(()=>opcoes('unidadeJurisdicionada_input').length>2,30);
  return { mun, ujs:opcoes('unidadeJurisdicionada_input'), anos:opcoes('competenciaPCAno_input'), pers:opcoes('PeriodicidadePC_input') };
 }
 const txt=c=>{const k=c.cloneNode(true); k.querySelectorAll('.ui-column-title').forEach(e=>e.remove()); return k.textContent.replace(/\s+/g,' ').trim().replace(/^(Compet[êe]ncia|Tipo|Unidade Jurisdicionada|Data de Envio|Status)\s*/i,'');};
 const TAB='[id="consultaPublicaTabPanel:consultaPublicaDataTable"]';
 const linhas=()=>[...D().querySelectorAll(TAB+' tbody tr')].map(r=>({r,c:[...r.cells].map(txt)})).filter(x=>x.c.length>=6);
 async function filtrar(al){
  if(!await recarregar()) throw new Error('e-TCM não carregou');
  const mun=opcoes('municipio_input').find(m=>norm(m.t)===norm(MUN));
  await sel('municipio','municipio_input',mun.v); await ate(()=>opcoes('unidadeJurisdicionada_input').some(o=>o.v==al.uj),30);
  const ano=opcoes('competenciaPCAno_input').find(o=>o.t==String(al.ano)); if(!ano) throw new Error('ano não existe '+al.ano);
  const per=opcoes('PeriodicidadePC_input').find(o=>norm(o.t)===norm(al.per)); if(!per) throw new Error('periodicidade não existe '+al.per);
  const q4=[['municipio','municipio_input',mun.v],['unidadeJurisdicionada','unidadeJurisdicionada_input',al.uj],['competenciaPCAno','competenciaPCAno_input',ano.v],['PeriodicidadePC','PeriodicidadePC_input',per.v]];
  for(const q of q4) await sel(...q);
  for(let k=0;k<3 && q4.some(q=>val(q[1])!=q[2]);k++) for(const q of q4) if(val(q[1])!=q[2]) await sel(...q);
  if(q4.some(q=>val(q[1])!=q[2])) throw new Error('filtros não ficaram');
  D().querySelector(`[id="${F}searchButton"]`).click(); await calma();
  await ate(()=>linhas().some(x=>norm(x.c[3])==norm(al.nomeUJ)),300);
 }
 // lista de prestações (regra 89): devolve as linhas da tabela de uma unidade/ano/periodicidade
 async function prestacoes(al){ await filtrar(al); const out=[]; for(let pg=0;pg<6;pg++){ out.push(...linhas().map(x=>x.c)); const prox=D().querySelector(TAB+' .ui-paginator-next:not(.ui-state-disabled)'); if(!prox) break; const a=D().querySelector(TAB+' tbody').innerHTML; prox.click(); await calma(); await ate(()=>D().querySelector(TAB+' tbody').innerHTML!=a,30);} return out; }
 async function uma(al){
  try{ const cods=(al.rx.source.match(/PC[A-Z]{3}\d{3}/g)||[]).filter(c=>!/PCMGE06[56]|PCAGO004/.test(c)); const cp=al.comp.includes('/')?al.comp.split('/').reverse().join('-'):al.comp+'-13_ANUAL';
   if(cods.length){ let todos=true; for(const c of cods){ const ex=await (await fetch(`${RX}/existe?pasta=${PASTA}&nome=${encodeURIComponent(cp+'_'+al.pre+c+'.pdf')}`)).json(); if(!ex.existe){todos=false;break;} }
    if(todos){ log(`${al.pre}${al.comp}: já tinha todos, pulado sem abrir`); return; } } }catch(e){}
  await filtrar(al);
  let tr=null;
  for(let pg=0;pg<6 && !tr;pg++){
   const x=linhas().find(x=>x.c[1]==al.comp && (!al.tipo||al.tipo.test(x.c[2])) && norm(x.c[3])==norm(al.nomeUJ)); if(x){tr=x.r;break;}
   const prox=D().querySelector(TAB+' .ui-paginator-next:not(.ui-state-disabled)'); if(!prox) break; const a=D().querySelector(TAB+' tbody').innerHTML; prox.click(); await calma(); await ate(()=>D().querySelector(TAB+' tbody').innerHTML!=a,30);
  }
  if(!tr) throw new Error('prestação não achada; 1ª linha: '+((linhas()[0]||{}).c||[]).join('|').slice(0,90));
  tr.querySelector('[id$=selecionarPrestacao]').click(); await calma();
  await ate(()=>D().querySelector('[id$=downloadDocBinario]')||D().getElementById('consultaPublicaTabPanel:formFiltros:classificacao_input'),1200);
  const cab=norm((D().body.innerText.match(/Compet[eê]ncia[\s\S]{0,300}/)||[''])[0]);
  if(!cab.includes(norm(al.nomeUJ)) || !cab.includes(al.comp)) throw new Error('cabeçalho não confere: '+cab.slice(0,160));
  const CL='consultaPublicaTabPanel:formFiltros:classificacao_input';
  const ops=[...D().getElementById(CL).options].map(o=>({v:o.value,t:o.text,cod:(o.text.match(/PC[A-Z]{3}\d{3}/)||[''])[0]})).filter(o=>(o.cod && al.rx.test(o.cod)) || (al.rxt && al.rxt.test(o.t)));
  const comp=al.comp.includes('/')?al.comp.split('/').reverse().join('-'):al.comp+'-13_ANUAL'; const cont={};
  if(!ops.length) { log(`${al.pre}${al.comp}: nenhuma classificação casou`); st.falhas.push(`${al.pre}${al.comp}: nenhuma classificação casou`); }
  for(const o of ops){
   const cod=o.cod||('X'+o.v);
   W().PrimeFaces.widgets.widget_consultaPublicaTabPanel_formFiltros_classificacao.selectValue(o.v); await calma();
   D().getElementById('consultaPublicaTabPanel:formFiltros:btnFiltrar').click(); await calma();
   await ate(()=>{const ls=[...D().querySelectorAll('[id$=downloadDocBinario]')]; return ls.length && (!o.cod || ls.every(a=>(a.closest('tr').textContent||'').includes(o.cod))) || /Nenhum|Não foram/i.test((D().querySelector('[id="consultaPublicaTabPanel:tabelaDocumentos"]')||{}).innerText||'');},300);
   const ls=[...D().querySelectorAll('[id$=downloadDocBinario]')].filter(a=>!o.cod || (a.closest('tr').textContent||'').includes(o.cod));
   log(`${al.pre}${al.comp} ${cod}: ${ls.length}`);
   for(const a of ls) await baixa1({id:a.id,codigo:o.cod||al.nome||cod});
  }
  async function baixa1(d){
   cont[d.codigo]=(cont[d.codigo]||0)+1; const nome=`${comp}_${al.pre}${d.codigo}${cont[d.codigo]>1?'_'+cont[d.codigo]:''}.pdf`;
   try{ const ex=await (await fetch(`${RX}/existe?pasta=${PASTA}&nome=${encodeURIComponent(nome)}`)).json(); if(ex.existe){ st.salvos.push(nome+' já existia'); return; } }catch(e){}
   let b=null; for(let k=0;k<3&&!b;k++){ try{ let u=null; const w0=W(); const ow=w0.open; w0.open=x=>{u=x;return null;}; try{ D().getElementById(d.id).click(); await ate(()=>u,300);} finally{w0.open=ow;} await calma(); if(u){ const r=await fetch(new URL(u,W().location.href).toString(),{credentials:'include'}); if(r.ok){ const bb=await r.blob(); if(bb.size) b=bb; } } }catch(e){ if(st.parar) throw e; await sleep(3000);} }
   if(!b){ st.falhas.push(nome+': não baixou'); return; }
   const r=await fetch(`${RX}/salva?txt=0&pasta=${PASTA}&nome=${encodeURIComponent(nome)}`,{method:'POST',body:b});
   if(r.ok) st.salvos.push(nome+' '+b.size); else st.falhas.push(nome+': recebedor '+r.status);
   await sleep(1000);
  }
 }
 async function fila(alvos){ st.rodando=true; st.parar=false; for(const al of alvos){ if(st.parar) break; log('alvo '+al.pre+al.comp); for(let k=0;k<2;k++){ try{ await uma(al); break; }catch(e){ log('ERRO '+al.pre+al.comp+': '+e.message); if(st.parar) break; if(k==1) st.falhas.push(al.pre+al.comp+': '+e.message); } } } st.rodando=false; log('FIM'); }
 return {st,info,fila,uma,prestacoes,linhas,opcoes,norm};
})(window.__MUN, window.__PASTA);
