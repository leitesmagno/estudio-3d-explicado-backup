# Brief único: vídeo de prefeitura no molde UBAITABA (09/11/2026)

Leia antes: `projetos/_coordenacao-sessoes.md` (regras até a 77), `projetos/_aprendizados.md`, `projetos/_prompt-orcamento-prefeitura.md`.
Referências aprovadas pelo Magno: **Ubaitaba (092, `src/videos/orcamentoubaitaba`)**, Camacan (042), Teixeira de Freitas (064), Dário Meira (056). Copie a apresentação e a maquete; só os números e as peculiaridades da cidade mudam.

## Obrigatório
1. **Cabeçalho** `src/videos/comum/CabecalhoCidade.tsx` com o nome da cidade: selo @eumagnoleite grande na abertura, viaja diminuindo até o cabeçalho, fica o vídeo todo, volta ao centro no "Segue o @eumagnoleite". Marca d'água quicando continua. Sem outras plaquinhas de @.
2. **Dados só do e-TCM.** "Gastou" = LIQUIDADO. Receita: na voz só o total declarado; folha de receita por ano com o detalhe. Conferir o nome do município dentro de cada PDF.
3. **Folha por setor para TODO setor na maquete** (`tools/lista_pdf`: `atualiza_params.py` → `setor_folhas.py` → `lista_pdf.py aplicar`):
   - até 2 ações: abre por tipo de despesa (salários, encargos, juros, parcelas, PASEP, sentenças, material, serviços, obras);
   - 3+ ações: nome das ações; máx. 6–7 linhas + "Outras";
   - faixa "Pessoal (salários e encargos): R$ X · diárias: R$ Y";
   - soma = valor falado; dinheiro sempre em número (R$ 1.234.567,89);
   - folha com uma linha só: voltar ao PDF e detalhar à mão;
   - setor ZERADO também tem folha e plaquinha: ações do PDF com "gasto R$ 0,00" (regra 48);
   - Câmara: faixa "Recebeu da prefeitura (duodécimo) R$ X · sobrou e devolveu R$ Y" + grupos.
4. **Sacadas no finalzinho:** festas, dívidas, pessoal, Câmara x setores carentes. **SEM tarifa bancária** (regra 60: tarifa SÓ em Ilhéus).
5. **Duração máxima 3:00.** Sem nome de gestor, sem percentuais, tom só informativo: nunca acusar ("má gestão", "desvio", "irregular", "suspeito"); o fechamento aprovado "Gastar não é crime. Mas se..., por que...?" é permitido. Processo no TCM: dizer o status exato (denúncia, em análise, advertência). Sem travessão. Voz Google Algenib (chave no Chaveiro; nunca gravar nem mostrar).
6. **Trava de render** `projetos/_render.lock` (uma por vez). **Trava de navegador** `projetos/_navegador.lock` (regra 53) antes de usar o e-TCM no navegador do app.
7. **Enquadramento (regras 71/73):** no Reels em tela cheia o celular corta ~60-70 px de cada lateral. Folhas, plaquinhas, chips e textos sempre a ≥ 90 px das laterais (esquerda E direita). O `lista_pdf.py` já usa margem 90 e escala 0,58: não coloque "escala" nem posições no config. Na revisão, confira os quadros com plaquinha perto da borda.
8. **Código compartilhado (regras 54/56/66):** `palavras.ts` e o `.tsx` sempre em sincronia; só registre no `Root.tsx` com `npx tsc --noEmit` passando; capa por entrada isolada (`entradaIsolada('Capa<Nome>')` + `npx remotion still src/_entrada_<Nome>.tsx ... --public-dir=.publica-links`).
9. **Refazer vídeo final depois de mudar o código (regra 75):** use `node scripts/render.mjs ... --refazer` (ou apague a pasta `.partes`), senão o render reaproveita as partes velhas que têm `.ok`.
10. **Zero na fala:** conferir todas as ações (inclusive em outras funções/secretarias) e dizer o que a secretaria gastou com ela mesma. Câmara: somar os grupos e conferir com o liquidado (o `camara_folha.py` pode pular linhas ".00").
11. **Modo autônomo:** roteiro revisado = aprovado; olhe você mesma os quadros de revisão (nada sobreposto, 3D condizendo com a fala). Não pergunte ao Magno.

## Entrega
- `NOME.mp4` em `~/Documents/VIDEOS PRONTOS - FOLHA POR SETOR/` (só mp4 ali);
- capa e legenda em `edicoes/NNN. .../` (`NOME - capa.jpg`, `NOME - legenda.txt` com ⚖️ AVISO no fim do post e comentário fixado depois do `---`). NÃO criar pasta em Documentos: o coordenador copia para `Documentos/NOVO LOTE/NOME/` (vídeo, capa, legenda);
- `andamento.md` atualizado; avisar o coordenador com o caminho e os números principais. Sempre em português.
