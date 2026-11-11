// Baixador do COFRE: roda DENTRO da página do e-TCM (Consulta Pública) num navegador de verdade (Chrome do Magno).
// Baixa TODOS os documentos de todas as unidades do município, de ANO0 até hoje, num ritmo calmo,
// e manda cada um direto para a nuvem do site (recebedor 127.0.0.1:8778/nuvem). Nada fica no Mac.
// Uso no console/javascript da página:
//   eval(await (await fetch('http://127.0.0.1:8778/cofre.js')).text());
//   cofre.fila(['NAZARE','BUERAREMA',...], 2016)   // começa (retoma sozinho o que já subiu)
//   cofre.estado                                    // andamento
//   cofre.parar()
(() => {
  const F = 'consultaPublicaTabPanel:consultaPublicaPCSearchForm:';
  const PRE = 'widget_consultaPublicaTabPanel_consultaPublicaPCSearchForm_';
  const RX = 'http://127.0.0.1:8778';
  const PAUSA = 1500;                       // entre um documento e outro (ritmo calmo)
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const slug = s => norm(s).toLowerCase().replace(/ /g, '-');
  // espera com Web Worker: não é freada quando a aba fica em segundo plano
  const W = new Worker(URL.createObjectURL(new Blob(['onmessage=e=>setTimeout(()=>postMessage(e.data.id),e.data.ms)'])));
  const esperas = {}; let nid = 0; W.onmessage = e => { esperas[e.data](); delete esperas[e.data]; };
  const sleep = ms => new Promise(r => { const id = ++nid; esperas[id] = r; W.postMessage({ id, ms }); });
  const st = { rodando: false, cidade: '', unidade: '', ano: '', prestacao: '', enviados: 0, pulados: 0, falhas: 0, cidadesFeitas: [], inicio: null, ultimo: '' };
  let PARAR = false;
  const log = (...a) => { const t = a.join(' '); st.ultimo = t; fetch(RX + '/nuvem/log', { method: 'POST', body: `${new Date().toLocaleTimeString('pt-BR')} ${t}` }).catch(() => {}); };
  async function ajax() {
    for (let i = 0; i < 240; i++) {
      const ok = window.PrimeFaces && PrimeFaces.ajax.Queue.isEmpty() && !document.querySelector('.ui-blockui[style*="display: block"]');
      if (ok) { await sleep(400); return; } await sleep(500);
    }
  }
  const opcoes = id => [...document.getElementById(id).options].map(o => ({ v: o.value, t: o.text.trim() })).filter(o => o.v && !/Clique/.test(o.v));
  async function sel(w, v) { PrimeFaces.widgets[PRE + w].selectValue(v); await ajax(); }
  async function irPesquisa() {
    if (!document.querySelector(`[id="${F}searchButton"]`)) { [...document.querySelectorAll('a')].find(e => e.textContent.trim() == 'Pesquisa')?.click(); await ajax(); }
  }
  const txt = c => { const k = c.cloneNode(true); k.querySelectorAll('.ui-column-title').forEach(e => e.remove()); return k.textContent.replace(/\s+/g, ' ').trim().replace(/^(Compet[êe]ncia|Tipo|Unidade Jurisdicionada|Data de Envio|Status)\s*/i, ''); };
  const TAB = '[id="consultaPublicaTabPanel:consultaPublicaDataTable"]';
  const linhasTabela = () => [...document.querySelectorAll(TAB + ' tbody tr')].map(r => [...r.cells].map(txt)).filter(c => c.length >= 6);
  const assinatura = () => (document.querySelector(TAB + ' tbody') || {}).innerHTML || '';
  async function esperaMudar(antes) { for (let i = 0; i < 30 && assinatura() === antes; i++) await sleep(500); await ajax(); await sleep(600); }
  async function pesquisar(mun, uj, anoV, per) {
    await irPesquisa();
    const anoT = (opcoes(F + 'competenciaPCAno_input').find(o => o.v == anoV) || {}).t || '';
    for (let tent = 0; tent < 4; tent++) {
      await sel('municipio', mun); await sleep(800); await sel('unidadeJurisdicionada', uj); await sleep(800);
      await sel('competenciaPCAno', anoV); await sleep(800); await sel('PeriodicidadePC', per); await sleep(1500);
      const antes = assinatura(); document.querySelector(`[id="${F}searchButton"]`).click(); await esperaMudar(antes); await sleep(800);
      const ls = linhasTabela();
      // confere se a tabela é mesmo do ano pedido (o filtro às vezes chega atrasado)
      if (!ls.length || ls.every(c => c[1].endsWith(anoT))) break;
      log('filtro atrasado, pesquisando de novo', anoT, ls[0][1]);
    }
    const out = [];
    for (let pg = 0; pg < 20; pg++) {
      out.push(...linhasTabela().filter(c => c[1].endsWith(anoT)).map(c => ({ competencia: c[1], tipo: c[2], envio: c[4], status: c[5], pg })));
      const prox = document.querySelector('[id="consultaPublicaTabPanel:consultaPublicaDataTable"] .ui-paginator-next:not(.ui-state-disabled)');
      if (!prox) break; const an = assinatura(); prox.click(); await esperaMudar(an);
    }
    return out;
  }
  async function documentos(mun, uj, anoV, per, l) {
    await pesquisar(mun, uj, anoV, per);
    // a busca termina na última página; volta para a primeira e anda até a página da prestação
    const pri = document.querySelector(TAB + ' .ui-paginator-first:not(.ui-state-disabled)'); if (pri) { const an = assinatura(); pri.click(); await esperaMudar(an); }
    for (let pg = 0; pg < l.pg; pg++) { const an = assinatura(); document.querySelector(TAB + ' .ui-paginator-next')?.click(); await esperaMudar(an); }
    const tr = [...document.querySelectorAll(TAB + ' tbody tr')].find(r => { const c = [...r.cells].map(txt); return c[1] == l.competencia && c[2] == l.tipo; });
    if (!tr) return [];
    tr.querySelector('[id$=selecionarPrestacao]').click(); await ajax();
    for (let i = 0; i < 60 && !document.querySelector('[id$=downloadDocBinario]'); i++) await sleep(1000);
    const w = PrimeFaces.widgets.widget_consultaPublicaTabPanel_tabelaDocumentos;
    if (w && w.getPaginator && w.getPaginator()) { w.getPaginator().setRowsPerPage(500); await ajax(); await sleep(1500); }
    return [...document.querySelectorAll('[id$=downloadDocBinario]')].map(a => { const tr = a.closest('tr');
      return { id: a.id, codigo: (tr.textContent || '').match(/(PC[A-Z]{3}\d{3}[A-Z]?)/)?.[1] || 'SEMCOD', titulo: (a.querySelector('img') || {}).title || a.textContent.trim() }; });
  }
  async function baixar(id) {
    let u = null; const ow = window.open; window.open = x => { u = x; return null; };
    try { document.getElementById(id).click(); for (let i = 0; i < 60 && !u; i++) await sleep(500); } finally { window.open = ow; }
    if (!u) return null;
    const r = await fetch(new URL(u, location.href).toString(), { credentials: 'include' });
    if (!r.ok) return null;
    const b = await r.blob(); return b.size ? b : null;
  }
  async function envia(pasta, nome, b) {
    for (let k = 0; k < 120; k++) {
      try {
        const r = await fetch(`${RX}/nuvem?confia=1&pasta=${encodeURIComponent(pasta)}&nome=${encodeURIComponent(nome)}`, { method: 'POST', body: b });
        if (r.ok) return true; if (r.status !== 503) { log('nuvem recusou', r.status, nome); return false; }
      } catch (e) { log('recebedor fora do ar, tentando de novo'); }
      await sleep(10000);
    }
    return false;
  }
  async function cidade(nomeCid, A0) {
    await irPesquisa(); for (let i = 0; i < 20 && !document.getElementById(F + 'municipio_input'); i++) await sleep(1000);
    const muns = opcoes(F + 'municipio_input'); const mun = muns.find(m => norm(m.t) === norm(nomeCid) || m.v === nomeCid);
    if (!mun) { log('município não encontrado no TCM:', nomeCid); return; }
    const nm = norm(mun.t); const pasta = slug(mun.t).toUpperCase();
    const ujs = opcoes(F + 'unidadeJurisdicionada_input').filter(u => { const t = norm(u.t); return t.endsWith(' ' + nm) || t.includes(' ' + nm + ' ') || t.includes(' DE ' + nm) || t.includes(' DO ' + nm); });
    const anos = opcoes(F + 'competenciaPCAno_input').filter(a => +a.t >= A0).sort((a, b) => +a.t - +b.t);
    const feitos = new Set(await (await fetch(`${RX}/nuvem/feitos?pasta=${pasta}`)).json());
    const vistas = new Set();
    st.cidade = mun.t; log(`COMEÇA ${mun.t}: ${ujs.length} unidades (${ujs.map(u => u.t).join(' | ')}), ${anos.length} anos, ${feitos.size} já na nuvem`);
    for (const uj of ujs) for (const ano of anos) for (const per of ['2', '1']) {
      if (PARAR) return;
      st.unidade = uj.t; st.ano = ano.t;
      let linhas = [];
      try { linhas = await pesquisar(mun.v, uj.v, ano.v, per); } catch (e) { log('erro na pesquisa', uj.t, ano.t, e.message); await sleep(5000); continue; }
      for (const l of linhas) {
        if (PARAR) return;
        const kp = `${uj.v}|${l.competencia}|${l.tipo}`; if (vistas.has(kp)) continue; vistas.add(kp);
        const comp = l.competencia.includes('/') ? l.competencia.split('/').reverse().join('-') : `${l.competencia}-13`;
        st.prestacao = `${comp} ${l.tipo}`;
        let docs = [];
        for (let k = 0; k < 3 && !docs.length; k++) { try { docs = await documentos(mun.v, uj.v, ano.v, per, l); } catch (e) { log('erro ao abrir', comp, e.message); await sleep(5000); } }
        const cont = {}; let novos = 0;
        for (const d of docs) {
          if (PARAR) return;
          cont[d.codigo] = (cont[d.codigo] || 0) + 1;
          const nome = `${slug(uj.t).slice(0, 40)}__${comp}_${d.codigo}_${String(cont[d.codigo]).padStart(2, '0')}_${slug(d.titulo).slice(0, 50)}.pdf`;
          if (feitos.has(nome)) { st.pulados++; continue; }
          let b = null; for (let k = 0; k < 3 && !b; k++) { try { b = await baixar(d.id); } catch (e) { await sleep(3000); } }
          if (!b || !(await envia(pasta, nome, b))) { st.falhas++; log('falhou', nome); continue; }
          feitos.add(nome); st.enviados++; novos++;
          await sleep(PAUSA);
        }
        log(`${mun.t} · ${uj.t} · ${comp} ${l.tipo}: ${docs.length} documentos, ${novos} novos (total enviados ${st.enviados})`);
      }
    }
    st.cidadesFeitas.push(mun.t); log(`FIM ${mun.t}`);
  }
  // FASE 1 (pedido da aba do site): Balanço Orçamentário anual da Prefeitura, só os anos que faltam.
  // fila = [{pasta:'NAZARE', tcm:'NAZARE', anos:[2016,...]}]; grava no Mac via /salva (com .txt) como <ano>-13_ANUAL_PCAGO015.pdf
  const pend = t => fetch(RX + '/pendencia', { method: 'POST', body: t }).catch(() => {});
  async function balancosCidade(c) {
    await irPesquisa(); for (let i = 0; i < 20 && !document.getElementById(F + 'municipio_input'); i++) await sleep(1000);
    const mun = opcoes(F + 'municipio_input').find(m => norm(m.t) === norm(c.tcm));
    if (!mun) { log('município não encontrado no TCM:', c.tcm); pend(`${c.pasta}: município não achado no e-TCM`); return; }
    const nm = norm(mun.t);
    const pref = opcoes(F + 'unidadeJurisdicionada_input').find(u => { const t = norm(u.t); return t.startsWith('PREFEITURA') && (t.endsWith(' ' + nm) || t.includes(' DE ' + nm)); });
    if (!pref) { log('prefeitura não achada', c.tcm); pend(`${c.pasta}: unidade Prefeitura não achada no e-TCM`); return; }
    st.cidade = mun.t; log(`BALANÇOS ${mun.t}: anos ${c.anos.join(',')}`);
    for (const ano of c.anos) {
      if (PARAR) return; st.ano = ano;
      await irPesquisa(); for (let i = 0; i < 20 && !document.getElementById(F + 'competenciaPCAno_input'); i++) await sleep(1000);
      const a = opcoes(F + 'competenciaPCAno_input').find(o => o.t == String(ano));
      if (!a) { pend(`${c.pasta} ${ano}: ano não existe no filtro do e-TCM`); continue; }
      let ok = 0;
      if ((await (await fetch(`${RX}/existe?pasta=${c.pasta}&nome=${ano}-13_ANUAL_PCAGO015.pdf`)).json()).existe) { log(c.pasta, ano, 'já estava'); continue; }
      try {
        const ls = await pesquisar(mun.v, pref.v, a.v, '1');
        const l = ls.find(x => /Governo/i.test(x.tipo) && x.competencia == String(ano));
        if (!l) { pend(`${c.pasta} ${ano}: prestação anual de Governo não aparece no e-TCM`); log(c.pasta, ano, 'sem prestação anual'); continue; }
        const docs = await documentos(mun.v, pref.v, a.v, '1', l);
        const alvo = [...document.querySelectorAll('[id$=downloadDocBinario]')].filter(x => /balan[çc]o or[çc]ament[áa]rio|PCAGO015|anexo 12/i.test(x.closest('tr').textContent));
        for (const d of alvo) {
          const b = await baixar(d.id); if (!b) continue;
          const nome = `${ano}-13_ANUAL_PCAGO015${ok ? '_' + (ok + 1) : ''}.pdf`;
          const r = await fetch(`${RX}/salva?txt=1&pasta=${encodeURIComponent(c.pasta)}&nome=${encodeURIComponent(nome)}`, { method: 'POST', body: b });
          if (r.ok) { ok++; st.enviados++; } await sleep(PAUSA);
        }
        log(`${c.pasta} ${ano}: ${docs.length} documentos na prestação, ${ok} do balanço orçamentário salvos`);
      } catch (e) { log('erro', c.pasta, ano, e.message); }
      if (!ok) { st.falhas++; pend(`${c.pasta} ${ano}: Balanço Orçamentário anual não baixou (não achado na prestação ou falha)`); }
    }
    st.cidadesFeitas.push(c.pasta); log(`FIM BALANÇOS ${c.pasta}`);
  }
  // PAGAMENTOS (pedido da aba do site, 10/11): PCMGE056 mensal 2024–2026 de todas as unidades da cidade, cópia LOCAL via /salva.
  // fila = [{pasta:'CAMACARI', tcm:'CAMACARI', slug:'camacari'}]. Grava <AAAA-MM>_<UNIDADE>_PCMGE056[_n].pdf e a lista de prestações (regra 89).
  const abrev = t => norm(t).replace(/ DE | DO | DA | DOS | DAS /g, ' ').split(' ').filter(Boolean).map(w => w.length > 3 ? w.slice(0, 4) : w).slice(0, 5).join('-');
  async function pagamentosCidade(c, anosP) {
    await irPesquisa(); for (let i = 0; i < 20 && !document.getElementById(F + 'municipio_input'); i++) await sleep(1000);
    const mun = opcoes(F + 'municipio_input').find(m => norm(m.t) === norm(c.tcm));
    if (!mun) { log('município não encontrado no TCM:', c.tcm); pend(`${c.pasta}: município não achado no e-TCM (pagamentos)`); return; }
    const nm = norm(mun.t);
    const ujs = opcoes(F + 'unidadeJurisdicionada_input').filter(u => { const t = norm(u.t); return t.endsWith(' ' + nm) || t.includes(' ' + nm + ' ') || t.includes(' DE ' + nm) || t.includes(' DO ' + nm); });
    st.cidade = mun.t; log(`PAGAMENTOS ${mun.t}: ${ujs.length} unidades (${ujs.map(u => u.t).join(' | ')})`);
    const prest = { cidade: mun.t, conferido_em: new Date().toISOString().slice(0, 16), unidade: '', mensais: [], outras: [] };
    let novos = 0;
    for (const uj of ujs) for (const ano of anosP) {
      if (PARAR) return;
      await irPesquisa(); for (let i = 0; i < 20 && !document.getElementById(F + 'competenciaPCAno_input'); i++) await sleep(1000);
      const a = opcoes(F + 'competenciaPCAno_input').find(o => o.t == String(ano)); if (!a) continue;
      st.unidade = uj.t; st.ano = ano;
      let ls = [];
      try { ls = await pesquisar(mun.v, uj.v, a.v, '2'); } catch (e) { log('erro na pesquisa', uj.t, ano, e.message); continue; }
      const linhasP = ls.filter(l => /\//.test(l.competencia)).map(l => ({ competencia: l.competencia, envio: l.envio, status: l.status, tipo: l.tipo }));
      if (/^PREFEITURA/.test(norm(uj.t))) { prest.unidade = uj.t; prest.mensais.push(...linhasP); } else prest.outras.push(...linhasP.map(x => ({ unidade: uj.t, ...x })));
      for (const l of ls) {
        if (PARAR) return;
        if (!/\//.test(l.competencia)) continue;               // só mensais
        const comp = l.competencia.split('/').reverse().join('-');
        const base = `${comp}_${abrev(uj.t)}_PCMGE056`;
        if ((await (await fetch(`${RX}/existe?pasta=${c.pasta}&nome=${base}.pdf`)).json()).existe) { st.pulados++; continue; }
        st.prestacao = `${comp} ${uj.t}`;
        let docs = [];
        for (let k = 0; k < 3 && !docs.length; k++) { try { docs = await documentos(mun.v, uj.v, a.v, '2', l); } catch (e) { await sleep(5000); } }
        const alvo = [...document.querySelectorAll('[id$=downloadDocBinario]')].filter(x => /PCMGE056|rela[çc][ãa]o de pagamentos/i.test(x.closest('tr').textContent));
        let ok = 0;
        for (const d of alvo) {
          const b = await baixar(d.id); if (!b) continue;
          const nome = `${base}${ok ? '_' + (ok + 1) : ''}.pdf`;
          const r = await fetch(`${RX}/salva?pasta=${encodeURIComponent(c.pasta)}&nome=${encodeURIComponent(nome)}`, { method: 'POST', body: b });
          if (r.ok) { ok++; novos++; st.enviados++; } await sleep(PAUSA);
        }
        if (docs.length && !alvo.length) log(c.pasta, comp, uj.t, 'sem PCMGE056 nesta prestação');
        if (docs.length && alvo.length && !ok) { st.falhas++; pend(`${c.pasta} ${comp} ${uj.t}: PCMGE056 não baixou`); }
      }
    }
    if (prest.mensais.length) await fetch(`${RX}/prestacoes?cidade=${c.slug}`, { method: 'POST', body: JSON.stringify(prest) }).catch(() => {});
    st.cidadesFeitas.push(c.pasta); log(`FIM PAGAMENTOS ${c.pasta}: ${novos} PDFs novos`);
  }
  window.cofre = {
    async pagamentos(fila, anosP = [2024, 2025, 2026]) {
      if (st.rodando) return 'já está rodando';
      st.rodando = true; PARAR = false; st.inicio = new Date().toISOString();
      try { for (const c of fila) { if (PARAR) break; await pagamentosCidade(c, anosP); } }
      catch (e) { log('ERRO GERAL', e.message); }
      finally { st.rodando = false; log(PARAR ? 'PARADO' : 'PAGAMENTOS: FILA TERMINADA'); }
    },
    async balancos(fila) {
      if (st.rodando) return 'já está rodando';
      st.rodando = true; PARAR = false; st.inicio = new Date().toISOString();
      try { for (const c of fila) { if (PARAR) break; await balancosCidade(c); } }
      catch (e) { log('ERRO GERAL', e.message); }
      finally { st.rodando = false; log(PARAR ? 'PARADO' : 'BALANÇOS: FILA TERMINADA'); }
    },
    estado: st,
    parar() { PARAR = true; },
    async fila(cidades, A0 = 2016) {
      if (st.rodando) return 'já está rodando';
      st.rodando = true; PARAR = false; st.inicio = new Date().toISOString();
      try { for (const c of cidades) { if (PARAR) break; await cidade(c, A0); } }
      catch (e) { log('ERRO GERAL', e.message); }
      finally { st.rodando = false; log(PARAR ? 'PARADO' : 'FILA TERMINADA'); }
    },
    _teste: { pesquisar, documentos, opcoes, F, norm },
  };
})();
