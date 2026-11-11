// Registro das composições do Estúdio.
// Para cada vídeo novo (código "juroscartao", Nome "JurosCartao") registre quatro composições:
//   <Nome>       vídeo normal            <Nome>Guia   com a moldura da área segura (revisão)
//   <Nome>Limpo  só o 3D, sem interface  Capa<Nome>   capa still 1080 × 1920
// O vídeo normal recebe defaultProps {faixas, revisao} para o render.mjs e o quadros.mjs.
import React from 'react';
import {Composition, Still} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {Exemplo, CapaExemplo, FAIXAS as FAIXAS_EXEMPLO, QUADROS as QUADROS_EXEMPLO, REVISAO as REVISAO_EXEMPLO} from './videos/exemplo/Exemplo';
import {Catalogo} from './videos/catalogo/Catalogo';
import {AmostraEstilo} from './videos/amostra/AmostraEstilo';
import {GaleriaPecas} from './pecas/galeria/registro';
import {Escala6x1, CapaEscala6x1, FAIXAS as FAIXAS_E61, QUADROS as QUADROS_E61, REVISAO as REVISAO_E61} from './videos/escala6x1/Escala6x1';
import {GovernoCasa, CapaGovernoCasa, FAIXAS as FAIXAS_GC, QUADROS as QUADROS_GC, REVISAO as REVISAO_GC} from './videos/governocasa/GovernoCasa';
import {FlavioAliados, CapaFlavioAliados, FAIXAS as FAIXAS_FA, QUADROS as QUADROS_FA, REVISAO as REVISAO_FA} from './videos/flavioaliados/FlavioAliados';
import {OnibusEleicao, CapaOnibusEleicao, FAIXAS as FAIXAS_OE, QUADROS as QUADROS_OE, REVISAO as REVISAO_OE} from './videos/onibuseleicao/OnibusEleicao';
import {MudancasIlheus, CapaMudancasIlheus, FAIXAS as FAIXAS_MI, QUADROS as QUADROS_MI, REVISAO as REVISAO_MI} from './videos/mudancasilheus/MudancasIlheus';
import {IlheusVolta, CapaIlheusVolta, FAIXAS as FAIXAS_IV, QUADROS as QUADROS_IV, REVISAO as REVISAO_IV} from './videos/ilheusvolta/IlheusVolta';
import {FabricaFake, CapaFabricaFake, FAIXAS as FAIXAS_FF, QUADROS as QUADROS_FF, REVISAO as REVISAO_FF} from './videos/fabricafake/FabricaFake';
import {DemissaoVoto, CapaDemissaoVoto, FAIXAS as FAIXAS_DV, QUADROS as QUADROS_DV, REVISAO as REVISAO_DV} from './videos/demissaovoto/DemissaoVoto';
import {FakeIcms, CapaFakeIcms, FAIXAS as FAIXAS_FI, QUADROS as QUADROS_FI, REVISAO as REVISAO_FI} from './videos/fakeicms/FakeIcms';
import {DistritalMisto, CapaDistritalMisto, FAIXAS as FAIXAS_DM, QUADROS as QUADROS_DM, REVISAO as REVISAO_DM} from './videos/distritalmisto/DistritalMisto';
import {QuemDistrital, CapaQuemDistrital, FAIXAS as FAIXAS_QD, QUADROS as QUADROS_QD, REVISAO as REVISAO_QD} from './videos/quemdistrital/QuemDistrital';
import {EleicaoEua, CapaEleicaoEua, FAIXAS as FAIXAS_EE, QUADROS as QUADROS_EE, REVISAO as REVISAO_EE} from './videos/eleicaoeua/EleicaoEua';
import {MidtermsResultado, CapaMidtermsResultado, FAIXAS as FAIXAS_MR, QUADROS as QUADROS_MR, REVISAO as REVISAO_MR} from './videos/midtermsresultado/MidtermsResultado';
import {OnibusIlheus, CapaOnibusIlheus, FAIXAS as FAIXAS_ON, QUADROS as QUADROS_ON, REVISAO as REVISAO_ON} from './videos/onibusilheus/OnibusIlheus';
import {OrcamentoItabuna, CapaOrcamentoItabuna, FAIXAS as FAIXAS_OIT, QUADROS as QUADROS_OIT, REVISAO as REVISAO_OIT} from './videos/orcamentoitabuna/OrcamentoItabuna';
import {OrcamentoUna, CapaOrcamentoUna, FAIXAS as FAIXAS_OUN, QUADROS as QUADROS_OUN, REVISAO as REVISAO_OUN} from './videos/orcamentouna/OrcamentoUna';
import {OrcamentoSp, CapaOrcamentoSp, FAIXAS as FAIXAS_OSP, QUADROS as QUADROS_OSP, REVISAO as REVISAO_OSP} from './videos/orcamentosp/OrcamentoSp';
import {OrcamentoConquista, CapaOrcamentoConquista, FAIXAS as FAIXAS_QUISTA, QUADROS as QUADROS_QUISTA, REVISAO as REVISAO_QUISTA} from './videos/orcamentoconquista/OrcamentoConquista';
import {OrcamentoSalvador, CapaOrcamentoSalvador, FAIXAS as FAIXAS_LVADOR, QUADROS as QUADROS_LVADOR, REVISAO as REVISAO_LVADOR} from './videos/orcamentosalvador/OrcamentoSalvador';
import {OrcamentoPortoSeguro, CapaOrcamentoPortoSeguro, FAIXAS as FAIXAS_SEGURO, QUADROS as QUADROS_SEGURO, REVISAO as REVISAO_SEGURO} from './videos/orcamentoportoseguro/OrcamentoPortoSeguro';
import {OrcamentoEunapolis, CapaOrcamentoEunapolis, FAIXAS as FAIXAS_EUN, QUADROS as QUADROS_EUN, REVISAO as REVISAO_EUN} from './videos/orcamentoeunapolis/OrcamentoEunapolis';
import {OrcamentoBrumado, CapaOrcamentoBrumado, FAIXAS as FAIXAS_BRU, QUADROS as QUADROS_BRU, REVISAO as REVISAO_BRU} from './videos/orcamentobrumado/OrcamentoBrumado';
import {OrcamentoFeira, CapaOrcamentoFeira, FAIXAS as FAIXAS_FEI, QUADROS as QUADROS_FEI, REVISAO as REVISAO_FEI} from './videos/orcamentofeira/OrcamentoFeira';
import {OrcamentoCoaraci, CapaOrcamentoCoaraci, FAIXAS as FAIXAS_COA, QUADROS as QUADROS_COA, REVISAO as REVISAO_COA} from './videos/orcamentocoaraci/OrcamentoCoaraci';
import {OrcamentoBelmonte, CapaOrcamentoBelmonte, FAIXAS as FAIXAS_BEL, QUADROS as QUADROS_BEL, REVISAO as REVISAO_BEL} from './videos/orcamentobelmonte/OrcamentoBelmonte';
import {OrcamentoCanavieiras, CapaOrcamentoCanavieiras, FAIXAS as FAIXAS_CAN, QUADROS as QUADROS_CAN, REVISAO as REVISAO_CAN} from './videos/orcamentocanavieiras/OrcamentoCanavieiras';
import {OrcamentoParatinga, CapaOrcamentoParatinga, FAIXAS as FAIXAS_PAR, QUADROS as QUADROS_PAR, REVISAO as REVISAO_PAR} from './videos/orcamentoparatinga/OrcamentoParatinga';
import {OrcamentoCabralia, CapaOrcamentoCabralia, FAIXAS as FAIXAS_CAB, QUADROS as QUADROS_CAB, REVISAO as REVISAO_CAB} from './videos/orcamentocabralia/OrcamentoCabralia';
import {ArrecadacaoBelmonte, CapaArrecadacaoBelmonte, FAIXAS as FAIXAS_ARB, QUADROS as QUADROS_ARB, REVISAO as REVISAO_ARB} from './videos/arrecadacaobelmonte/ArrecadacaoBelmonte';
import {OrcamentoCamacari, CapaOrcamentoCamacari, FAIXAS as FAIXAS_CMC, QUADROS as QUADROS_CMC, REVISAO as REVISAO_CMC} from './videos/orcamentocamacari/OrcamentoCamacari';
import {OrcamentoItajuipe, CapaOrcamentoItajuipe, FAIXAS as FAIXAS_ITJ, QUADROS as QUADROS_ITJ, REVISAO as REVISAO_ITJ} from './videos/orcamentoitajuipe/OrcamentoItajuipe';
import {OrcamentoItapitanga, CapaOrcamentoItapitanga, FAIXAS as FAIXAS_ITP, QUADROS as QUADROS_ITP, REVISAO as REVISAO_ITP} from './videos/orcamentoitapitanga/OrcamentoItapitanga';
import {OrcamentoLivramento, CapaOrcamentoLivramento, FAIXAS as FAIXAS_LIV, QUADROS as QUADROS_LIV, REVISAO as REVISAO_LIV} from './videos/orcamentolivramento/OrcamentoLivramento';
import {OrcamentoGuanambi, CapaOrcamentoGuanambi, FAIXAS as FAIXAS_GUA, QUADROS as QUADROS_GUA, REVISAO as REVISAO_GUA} from './videos/orcamentoguanambi/OrcamentoGuanambi';
import {OrcamentoAnage, CapaOrcamentoAnage, FAIXAS as FAIXAS_ANA, QUADROS as QUADROS_ANA, REVISAO as REVISAO_ANA} from './videos/orcamentoanage/OrcamentoAnage';
import {OrcamentoPotiragua, CapaOrcamentoPotiragua, FAIXAS as FAIXAS_POT, QUADROS as QUADROS_POT, REVISAO as REVISAO_POT} from './videos/orcamentopotiragua/OrcamentoPotiragua';
import {OrcamentoCairu, CapaOrcamentoCairu, FAIXAS as FAIXAS_CAI, QUADROS as QUADROS_CAI, REVISAO as REVISAO_CAI} from './videos/orcamentocairu/OrcamentoCairu';
import {OrcamentoItapetinga, CapaOrcamentoItapetinga, FAIXAS as FAIXAS_ITG, QUADROS as QUADROS_ITG, REVISAO as REVISAO_ITG} from './videos/orcamentoitapetinga/OrcamentoItapetinga';
import {OrcamentoIbicarai, CapaOrcamentoIbicarai, FAIXAS as FAIXAS_IBI, QUADROS as QUADROS_IBI, REVISAO as REVISAO_IBI} from './videos/orcamentoibicarai/OrcamentoIbicarai';
import {OrcamentoUbaitaba, CapaOrcamentoUbaitaba, FAIXAS as FAIXAS_UBT, QUADROS as QUADROS_UBT, REVISAO as REVISAO_UBT} from './videos/orcamentoubaitaba/OrcamentoUbaitaba';
import {ParatingaSetores1824, CapaParatingaSetores1824, FAIXAS as FAIXAS_PS1824, QUADROS as QUADROS_PS1824, REVISAO as REVISAO_PS1824} from './videos/paratingasetores1824/ParatingaSetores1824';
import {ObrasIlheus10, CapaObrasIlheus10, FAIXAS as FAIXAS_OI10, QUADROS as QUADROS_OI10, REVISAO as REVISAO_OI10} from './videos/obrasilheus10/ObrasIlheus10';
import {SaudeIlheus10, CapaSaudeIlheus10, FAIXAS as FAIXAS_SI10, QUADROS as QUADROS_SI10, REVISAO as REVISAO_SI10} from './videos/saudeilheus10/SaudeIlheus10';
import {OrcamentoParatinga1824, CapaOrcamentoParatinga1824, FAIXAS as FAIXAS_PAR1824, QUADROS as QUADROS_PAR1824, REVISAO as REVISAO_PAR1824} from './videos/orcamentoparatinga1824/OrcamentoParatinga1824';
import {OrcamentoAlmadina, CapaOrcamentoAlmadina, FAIXAS as FAIXAS_ALM, QUADROS as QUADROS_ALM, REVISAO as REVISAO_ALM} from './videos/orcamentoalmadina/OrcamentoAlmadina';
import {OrcamentoNovaVicosa, CapaOrcamentoNovaVicosa, FAIXAS as FAIXAS_NVI, QUADROS as QUADROS_NVI, REVISAO as REVISAO_NVI} from './videos/orcamentonovavicosa/OrcamentoNovaVicosa';
import {OrcamentoMucuri, CapaOrcamentoMucuri, FAIXAS as FAIXAS_MUC, QUADROS as QUADROS_MUC, REVISAO as REVISAO_MUC} from './videos/orcamentomucuri/OrcamentoMucuri';
import {OrcamentoValenca, CapaOrcamentoValenca, FAIXAS as FAIXAS_VAL, QUADROS as QUADROS_VAL, REVISAO as REVISAO_VAL} from './videos/orcamentovalenca/OrcamentoValenca';
import {OrcamentoItubera, CapaOrcamentoItubera, FAIXAS as FAIXAS_ITU, QUADROS as QUADROS_ITU, REVISAO as REVISAO_ITU} from './videos/orcamentoitubera/OrcamentoItubera';
import {OrcamentoSeabra, CapaOrcamentoSeabra, FAIXAS as FAIXAS_SEA, QUADROS as QUADROS_SEA, REVISAO as REVISAO_SEA} from './videos/orcamentoseabra/OrcamentoSeabra';
import {OrcamentoParamirim, CapaOrcamentoParamirim, FAIXAS as FAIXAS_PMI, QUADROS as QUADROS_PMI, REVISAO as REVISAO_PMI} from './videos/orcamentoparamirim/OrcamentoParamirim';
import {OrcamentoItambe, CapaOrcamentoItambe, FAIXAS as FAIXAS_IBE, QUADROS as QUADROS_IBE, REVISAO as REVISAO_IBE} from './videos/orcamentoitambe/OrcamentoItambe';
import {OrcamentoIlheusTcm, CapaOrcamentoIlheusTcm, FAIXAS as FAIXAS_ILT, QUADROS as QUADROS_ILT, REVISAO as REVISAO_ILT} from './videos/orcamentoilheustcm/OrcamentoIlheusTcm';
import {OrcamentoCamacan, CapaOrcamentoCamacan, FAIXAS as FAIXAS_CMN, QUADROS as QUADROS_CMN, REVISAO as REVISAO_CMN} from './videos/orcamentocamacan/OrcamentoCamacan';
import {OrcamentoBarroPreto, CapaOrcamentoBarroPreto, FAIXAS as FAIXAS_BPR, QUADROS as QUADROS_BPR, REVISAO as REVISAO_BPR} from './videos/orcamentobarropreto/OrcamentoBarroPreto';
import {OrcamentoCaetite, CapaOrcamentoCaetite, FAIXAS as FAIXAS_CAE, QUADROS as QUADROS_CAE, REVISAO as REVISAO_CAE} from './videos/orcamentocaetite/OrcamentoCaetite';
import {OrcamentoCandidoSales, CapaOrcamentoCandidoSales, FAIXAS as FAIXAS_CSA, QUADROS as QUADROS_CSA, REVISAO as REVISAO_CSA} from './videos/orcamentocandidosales/OrcamentoCandidoSales';
import {OrcamentoCaravelas, CapaOrcamentoCaravelas, FAIXAS as FAIXAS_CRV, QUADROS as QUADROS_CRV, REVISAO as REVISAO_CRV} from './videos/orcamentocaravelas/OrcamentoCaravelas';
import {OrcamentoItabela, CapaOrcamentoItabela, FAIXAS as FAIXAS_ITB, QUADROS as QUADROS_ITB, REVISAO as REVISAO_ITB} from './videos/orcamentoitabela/OrcamentoItabela';
import {OrcamentoItacare, CapaOrcamentoItacare, FAIXAS as FAIXAS_ITC, QUADROS as QUADROS_ITC, REVISAO as REVISAO_ITC} from './videos/orcamentoitacare/OrcamentoItacare';
import {OrcamentoJequie, CapaOrcamentoJequie, FAIXAS as FAIXAS_JEQ, QUADROS as QUADROS_JEQ, REVISAO as REVISAO_JEQ} from './videos/orcamentojequie/OrcamentoJequie';
import {OrcamentoUrucuca, CapaOrcamentoUrucuca, FAIXAS as FAIXAS_URU, QUADROS as QUADROS_URU, REVISAO as REVISAO_URU} from './videos/orcamentourucuca/OrcamentoUrucuca';
import {OrcamentoBomJesus, CapaOrcamentoBomJesus, FAIXAS as FAIXAS_BJL, QUADROS as QUADROS_BJL, REVISAO as REVISAO_BJL} from './videos/orcamentobomjesus/OrcamentoBomJesus';
import {OrcamentoLauro, CapaOrcamentoLauro, FAIXAS as FAIXAS_LDF, QUADROS as QUADROS_LDF, REVISAO as REVISAO_LDF} from './videos/orcamentolauro/OrcamentoLauro';
import {OrcamentoTeixeira, CapaOrcamentoTeixeira, FAIXAS as FAIXAS_TXF, QUADROS as QUADROS_TXF, REVISAO as REVISAO_TXF} from './videos/orcamentoteixeira/OrcamentoTeixeira';
import {OrcamentoLem, CapaOrcamentoLem, FAIXAS as FAIXAS_LEM, QUADROS as QUADROS_LEM, REVISAO as REVISAO_LEM} from './videos/orcamentolem/OrcamentoLem';
import {OrcamentoRioDeContas, CapaOrcamentoRioDeContas, FAIXAS as FAIXAS_RDC, QUADROS as QUADROS_RDC, REVISAO as REVISAO_RDC} from './videos/orcamentoriodecontas/OrcamentoRioDeContas';
import {OrcamentoRioDeContasV2, CapaOrcamentoRioDeContasV2, FAIXAS as FAIXAS_RDC2, QUADROS as QUADROS_RDC2, REVISAO as REVISAO_RDC2} from './videos/orcamentoriodecontasv2/OrcamentoRioDeContasV2';
import {OrcamentoBarreiras, CapaOrcamentoBarreiras, FAIXAS as FAIXAS_BAR, QUADROS as QUADROS_BAR, REVISAO as REVISAO_BAR} from './videos/orcamentobarreiras/OrcamentoBarreiras';
import {OrcamentoItamaraju, CapaOrcamentoItamaraju, FAIXAS as FAIXAS_ITA, QUADROS as QUADROS_ITA, REVISAO as REVISAO_ITA} from './videos/orcamentoitamaraju/OrcamentoItamaraju';
import {OrcamentoSimoesFilho, CapaOrcamentoSimoesFilho, FAIXAS as FAIXAS_SIM, QUADROS as QUADROS_SIM, REVISAO as REVISAO_SIM} from './videos/orcamentosimoesfilho/OrcamentoSimoesFilho';
import {OrcamentoDarioMeira, CapaOrcamentoDarioMeira, FAIXAS as FAIXAS_DME, QUADROS as QUADROS_DME, REVISAO as REVISAO_DME} from './videos/orcamentodariomeira/OrcamentoDarioMeira';
import {EducacaoIlheus10, CapaEducacaoIlheus10, FAIXAS as FAIXAS_EDI, QUADROS as QUADROS_EDI, REVISAO as REVISAO_EDI} from './videos/educacaoilheus10/EducacaoIlheus10';
import {OrcamentoInhambupe, CapaOrcamentoInhambupe, FAIXAS as FAIXAS_INH, QUADROS as QUADROS_INH, REVISAO as REVISAO_INH} from './videos/orcamentoinhambupe/OrcamentoInhambupe';
import {OrcamentoIlheus, CapaOrcamentoIlheus, FAIXAS as FAIXAS_OI, QUADROS as QUADROS_OI, REVISAO as REVISAO_OI} from './videos/orcamentoilheus/OrcamentoIlheus';
import {OrcamentoGandu, CapaOrcamentoGandu, FAIXAS as FAIXAS_GND, QUADROS as QUADROS_GND, REVISAO as REVISAO_GND} from './videos/orcamentogandu/OrcamentoGandu';
import {OrcamentoMacaubas, CapaOrcamentoMacaubas, FAIXAS as FAIXAS_MCB, QUADROS as QUADROS_MCB, REVISAO as REVISAO_MCB} from './videos/orcamentomacaubas/OrcamentoMacaubas';
import {OrcamentoMataDeSaoJoao, CapaOrcamentoMataDeSaoJoao, FAIXAS as FAIXAS_MSJ, QUADROS as QUADROS_MSJ, REVISAO as REVISAO_MSJ} from './videos/orcamentomatadesaojoao/OrcamentoMataDeSaoJoao';
import {OrcamentoNazare, CapaOrcamentoNazare, FAIXAS as FAIXAS_NAZ, QUADROS as QUADROS_NAZ, REVISAO as REVISAO_NAZ} from './videos/orcamentonazare/OrcamentoNazare';
import {OrcamentoBuerarema, CapaOrcamentoBuerarema, FAIXAS as FAIXAS_BUE, QUADROS as QUADROS_BUE, REVISAO as REVISAO_BUE} from './videos/orcamentobuerarema/OrcamentoBuerarema';
import {OrcamentoFlorestaAzul, CapaOrcamentoFlorestaAzul, FAIXAS as FAIXAS_FLA, QUADROS as QUADROS_FLA, REVISAO as REVISAO_FLA} from './videos/orcamentoflorestaazul/OrcamentoFlorestaAzul';
import {OrcamentoGuaratinga, CapaOrcamentoGuaratinga, FAIXAS as FAIXAS_GRT, QUADROS as QUADROS_GRT, REVISAO as REVISAO_GRT} from './videos/orcamentoguaratinga/OrcamentoGuaratinga';
import {OrcamentoIbirataia, CapaOrcamentoIbirataia, FAIXAS as FAIXAS_IBR, QUADROS as QUADROS_IBR, REVISAO as REVISAO_IBR} from './videos/orcamentoibirataia/OrcamentoIbirataia';
import {OrcamentoItagiba, CapaOrcamentoItagiba, FAIXAS as FAIXAS_ITGB, QUADROS as QUADROS_ITGB, REVISAO as REVISAO_ITGB} from './videos/orcamentoitagiba/OrcamentoItagiba';
import {OrcamentoItajuDoColonia, CapaOrcamentoItajuDoColonia, FAIXAS as FAIXAS_ITJC, QUADROS as QUADROS_ITJC, REVISAO as REVISAO_ITJC} from './videos/orcamentoitajudocolonia/OrcamentoItajuDoColonia';
import {OrcamentoItapebi, CapaOrcamentoItapebi, FAIXAS as FAIXAS_ITPB, QUADROS as QUADROS_ITPB, REVISAO as REVISAO_ITPB} from './videos/orcamentoitapebi/OrcamentoItapebi';
import {OrcamentoMascote, CapaOrcamentoMascote, FAIXAS as FAIXAS_MSC, QUADROS as QUADROS_MSC, REVISAO as REVISAO_MSC} from './videos/orcamentomascote/OrcamentoMascote';
import {OrcamentoUbata, CapaOrcamentoUbata, FAIXAS as FAIXAS_UBTA, QUADROS as QUADROS_UBTA, REVISAO as REVISAO_UBTA} from './videos/orcamentoubata/OrcamentoUbata';
import {OrcamentoTancredoNeves, CapaOrcamentoTancredoNeves, FAIXAS as FAIXAS_PTN, QUADROS as QUADROS_PTN, REVISAO as REVISAO_PTN} from './videos/orcamentotancredoneves/OrcamentoTancredoNeves';
import {OrcamentoJussari, CapaOrcamentoJussari, FAIXAS as FAIXAS_JUS, QUADROS as QUADROS_JUS, REVISAO as REVISAO_JUS} from './videos/orcamentojussari/OrcamentoJussari';
import {OrcamentoSantaLuzia, CapaOrcamentoSantaLuzia, FAIXAS as FAIXAS_SLZ, QUADROS as QUADROS_SLZ, REVISAO as REVISAO_SLZ} from './videos/orcamentosantaluzia/OrcamentoSantaLuzia';
import {OrcamentoSaoJoseVitoria, CapaOrcamentoSaoJoseVitoria, FAIXAS as FAIXAS_SJV, QUADROS as QUADROS_SJV, REVISAO as REVISAO_SJV} from './videos/orcamentosaojosevitoria/OrcamentoSaoJoseVitoria';
import {OrcamentoBotupora, CapaOrcamentoBotupora, FAIXAS as FAIXAS_BTP, QUADROS as QUADROS_BTP, REVISAO as REVISAO_BTP} from './videos/orcamentobotupora/OrcamentoBotupora';
import {OrcamentoBarraEstiva, CapaOrcamentoBarraEstiva, FAIXAS as FAIXAS_BDE, QUADROS as QUADROS_BDE, REVISAO as REVISAO_BDE} from './videos/orcamentobarraestiva/OrcamentoBarraEstiva';
import {OrcamentoCacule, CapaOrcamentoCacule, FAIXAS as FAIXAS_CAC, QUADROS as QUADROS_CAC, REVISAO as REVISAO_CAC} from './videos/orcamentocacule/OrcamentoCacule';
import {OrcamentoTanhacu, CapaOrcamentoTanhacu, FAIXAS as FAIXAS_TNH, QUADROS as QUADROS_TNH, REVISAO as REVISAO_TNH} from './videos/orcamentotanhacu/OrcamentoTanhacu';
import {OrcamentoPiata, CapaOrcamentoPiata, FAIXAS as FAIXAS_PIA, QUADROS as QUADROS_PIA, REVISAO as REVISAO_PIA} from './videos/orcamentopiata/OrcamentoPiata';
import {OrcamentoArataca, CapaOrcamentoArataca, FAIXAS as FAIXAS_ARA, QUADROS as QUADROS_ARA, REVISAO as REVISAO_ARA} from './videos/orcamentoarataca/OrcamentoArataca';
import {OrcamentoMarau, CapaOrcamentoMarau, FAIXAS as FAIXAS_MAR, QUADROS as QUADROS_MAR, REVISAO as REVISAO_MAR} from './videos/orcamentomarau/OrcamentoMarau';
import {OrcamentoDiasDavila, CapaOrcamentoDiasDavila, FAIXAS as FAIXAS_DDA, QUADROS as QUADROS_DDA, REVISAO as REVISAO_DDA} from './videos/orcamentodiasdavila/OrcamentoDiasDavila';
import {OrcamentoCatu, CapaOrcamentoCatu, FAIXAS as FAIXAS_CATU, QUADROS as QUADROS_CATU, REVISAO as REVISAO_CATU} from './videos/orcamentocatu/OrcamentoCatu';
import {OrcamentoItape, CapaOrcamentoItape, FAIXAS as FAIXAS_ITAPE, QUADROS as QUADROS_ITAPE, REVISAO as REVISAO_ITAPE} from './videos/orcamentoitape/OrcamentoItape';
import {OrcamentoPojuca, CapaOrcamentoPojuca, FAIXAS as FAIXAS_POJUCA, QUADROS as QUADROS_POJUCA, REVISAO as REVISAO_POJUCA} from './videos/orcamentopojuca/OrcamentoPojuca';
import {OrcamentoIbotirama, CapaOrcamentoIbotirama, FAIXAS as FAIXAS_IBO, QUADROS as QUADROS_IBO, REVISAO as REVISAO_IBO} from './videos/orcamentoibotirama/OrcamentoIbotirama';
import {OrcamentoXiqueXique, CapaOrcamentoXiqueXique, FAIXAS as FAIXAS_XIQUEXIQUE, QUADROS as QUADROS_XIQUEXIQUE, REVISAO as REVISAO_XIQUEXIQUE} from './videos/orcamentoxiquexique/OrcamentoXiqueXique';
import {OrcamentoPauloAfonso, CapaOrcamentoPauloAfonso, FAIXAS as FAIXAS_PAULOAFONSO, QUADROS as QUADROS_PAULOAFONSO, REVISAO as REVISAO_PAULOAFONSO} from './videos/orcamentopauloafonso/OrcamentoPauloAfonso';
import {OrcamentoCarinhanha, CapaOrcamentoCarinhanha, FAIXAS as FAIXAS_CARINHANHA, QUADROS as QUADROS_CARINHANHA, REVISAO as REVISAO_CARINHANHA} from './videos/orcamentocarinhanha/OrcamentoCarinhanha';
import {OrcamentoSaoDesiderio, CapaOrcamentoSaoDesiderio, FAIXAS as FAIXAS_SAODESIDERIO, QUADROS as QUADROS_SAODESIDERIO, REVISAO as REVISAO_SAODESIDERIO} from './videos/orcamentosaodesiderio/OrcamentoSaoDesiderio';
import {OrcamentoRuyBarbosa, CapaOrcamentoRuyBarbosa, FAIXAS as FAIXAS_RUYBARBOSA, QUADROS as QUADROS_RUYBARBOSA, REVISAO as REVISAO_RUYBARBOSA} from './videos/orcamentoruybarbosa/OrcamentoRuyBarbosa';
import {OrcamentoRiachaoDoJacuipe, CapaOrcamentoRiachaoDoJacuipe, FAIXAS as FAIXAS_RIACHAODOJACUIPE, QUADROS as QUADROS_RIACHAODOJACUIPE, REVISAO as REVISAO_RIACHAODOJACUIPE} from './videos/orcamentoriachaodojacuipe/OrcamentoRiachaoDoJacuipe';
import {OrcamentoJaguarari, CapaOrcamentoJaguarari, FAIXAS as FAIXAS_JAGUARARI, QUADROS as QUADROS_JAGUARARI, REVISAO as REVISAO_JAGUARARI} from './videos/orcamentojaguarari/OrcamentoJaguarari';
import {OrcamentoSenhorDoBonfim, CapaOrcamentoSenhorDoBonfim, FAIXAS as FAIXAS_SDB, QUADROS as QUADROS_SDB, REVISAO as REVISAO_SDB} from './videos/orcamentosenhordobonfim/OrcamentoSenhorDoBonfim';
import {OrcamentoEntreRios, CapaOrcamentoEntreRios, FAIXAS as FAIXAS_ER, QUADROS as QUADROS_ER, REVISAO as REVISAO_ER} from './videos/orcamentoentrerios/OrcamentoEntreRios';
import {OrcamentoSerraDoRamalho, CapaOrcamentoSerraDoRamalho, FAIXAS as FAIXAS_SERRARAMALHO, QUADROS as QUADROS_SERRARAMALHO, REVISAO as REVISAO_SERRARAMALHO} from './videos/orcamentoserradoramalho/OrcamentoSerraDoRamalho';
import {OrcamentoItaberaba, CapaOrcamentoItaberaba, FAIXAS as FAIXAS_ITABERABA, QUADROS as QUADROS_ITABERABA, REVISAO as REVISAO_ITABERABA} from './videos/orcamentoitaberaba/OrcamentoItaberaba';
import {OrcamentoRiachaoDasNeves, CapaOrcamentoRiachaoDasNeves, FAIXAS as FAIXAS_RIACHAONEVES, QUADROS as QUADROS_RIACHAONEVES, REVISAO as REVISAO_RIACHAONEVES} from './videos/orcamentoriachaodasneves/OrcamentoRiachaoDasNeves';
import {OrcamentoMorroDoChapeu, CapaOrcamentoMorroDoChapeu, FAIXAS as FAIXAS_MORROCHAPEU, QUADROS as QUADROS_MORROCHAPEU, REVISAO as REVISAO_MORROCHAPEU} from './videos/orcamentomorrodochapeu/OrcamentoMorroDoChapeu';
import {OrcamentoIpira, CapaOrcamentoIpira, FAIXAS as FAIXAS_IPIRA, QUADROS as QUADROS_IPIRA, REVISAO as REVISAO_IPIRA} from './videos/orcamentoipira/OrcamentoIpira';
import {OrcamentoCastroAlves, CapaOrcamentoCastroAlves, FAIXAS as FAIXAS_CAV, QUADROS as QUADROS_CAV, REVISAO as REVISAO_CAV} from './videos/orcamentocastroalves/OrcamentoCastroAlves';
import {OrcamentoSaoFranciscoDoConde, CapaOrcamentoSaoFranciscoDoConde, FAIXAS as FAIXAS_SFC, QUADROS as QUADROS_SFC, REVISAO as REVISAO_SFC} from './videos/orcamentosaofranciscodoconde/OrcamentoSaoFranciscoDoConde';
import {OrcamentoInhambupeTcm, CapaOrcamentoInhambupeTcm, FAIXAS as FAIXAS_INT, QUADROS as QUADROS_INT, REVISAO as REVISAO_INT} from './videos/orcamentoinhambupetcm/OrcamentoInhambupeTcm';
import {OrcamentoSantoAmaro, CapaOrcamentoSantoAmaro, FAIXAS as FAIXAS_SAM, QUADROS as QUADROS_SAM, REVISAO as REVISAO_SAM} from './videos/orcamentosantoamaro/OrcamentoSantoAmaro';
import {OrcamentoSantoAntonio, CapaOrcamentoSantoAntonio, FAIXAS as FAIXAS_SAJ, QUADROS as QUADROS_SAJ, REVISAO as REVISAO_SAJ} from './videos/orcamentosantoantonio/OrcamentoSantoAntonio';
import {OrcamentoMaracas, CapaOrcamentoMaracas, FAIXAS as FAIXAS_MRC, QUADROS as QUADROS_MRC, REVISAO as REVISAO_MRC} from './videos/orcamentomaracas/OrcamentoMaracas';
import {DividaPublica, CapaDividaPublica, FAIXAS as FAIXAS_DP, QUADROS as QUADROS_DP, REVISAO as REVISAO_DP} from './videos/dividapublica/DividaPublica';
import {EducacaoIlheus, CapaEducacaoIlheus, FAIXAS as FAIXAS_EI, QUADROS as QUADROS_EI, REVISAO as REVISAO_EI} from './videos/educacaoilheus/EducacaoIlheus';
import {PecSeguranca, CapaPecSeguranca, FAIXAS as FAIXAS_PS, QUADROS as QUADROS_PS, REVISAO as REVISAO_PS} from './videos/pecseguranca/PecSeguranca';
import {ReformaTrib, CapaReformaTrib, FAIXAS as FAIXAS_RTB, QUADROS as QUADROS_RTB, REVISAO as REVISAO_RTB} from './videos/reformatrib/ReformaTrib';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;

export const Root: React.FC = () => (
  <>
    {/* ---------- Ferramentas do Estúdio ---------- */}
    <Composition id="Catalogo" component={Catalogo} durationInFrames={120} {...base} defaultProps={{estilo: ATIVO, revisao: [0, 1.5, 3]}} />
    <Still id="AmostraEstilo" component={AmostraEstilo} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <GaleriaPecas />

    {/* ---------- Vídeo de exemplo ---------- */}
    <Composition id="Exemplo" component={Exemplo} durationInFrames={QUADROS_EXEMPLO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_EXEMPLO, revisao: REVISAO_EXEMPLO}} />
    <Composition id="ExemploGuia" component={Exemplo} durationInFrames={QUADROS_EXEMPLO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_EXEMPLO, revisao: REVISAO_EXEMPLO}} />
    <Composition id="ExemploLimpo" component={Exemplo} durationInFrames={QUADROS_EXEMPLO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_EXEMPLO, revisao: REVISAO_EXEMPLO}} />
    <Still id="CapaExemplo" component={CapaExemplo} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />

    {/* ---------- Molde 001. escala 6x1 ---------- */}
    <Composition id="Escala6x1" component={Escala6x1} durationInFrames={QUADROS_E61} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_E61, revisao: REVISAO_E61}} />
    <Composition id="Escala6x1Guia" component={Escala6x1} durationInFrames={QUADROS_E61} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_E61, revisao: REVISAO_E61}} />
    <Composition id="Escala6x1Limpo" component={Escala6x1} durationInFrames={QUADROS_E61} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_E61, revisao: REVISAO_E61}} />
    <Still id="CapaEscala6x1" component={CapaEscala6x1} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />

    {/* ---------- 002. dívida pública ---------- */}
    <Composition id="DividaPublica" component={DividaPublica} durationInFrames={QUADROS_DP} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_DP, revisao: REVISAO_DP}} />
    <Composition id="DividaPublicaGuia" component={DividaPublica} durationInFrames={QUADROS_DP} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_DP, revisao: REVISAO_DP}} />
    <Composition id="DividaPublicaLimpo" component={DividaPublica} durationInFrames={QUADROS_DP} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_DP, revisao: REVISAO_DP}} />
    <Still id="CapaDividaPublica" component={CapaDividaPublica} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />

    {/* ---------- 003. o governo não é a sua casa ---------- */}
    <Composition id="GovernoCasa" component={GovernoCasa} durationInFrames={QUADROS_GC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_GC, revisao: REVISAO_GC}} />
    <Composition id="GovernoCasaGuia" component={GovernoCasa} durationInFrames={QUADROS_GC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_GC, revisao: REVISAO_GC}} />
    <Composition id="GovernoCasaLimpo" component={GovernoCasa} durationInFrames={QUADROS_GC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_GC, revisao: REVISAO_GC}} />
    <Still id="CapaGovernoCasa" component={CapaGovernoCasa} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />

    {/* ---------- 004. flávio bolsonaro e aliados ---------- */}
    <Composition id="FlavioAliados" component={FlavioAliados} durationInFrames={QUADROS_FA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_FA, revisao: REVISAO_FA}} />
    <Composition id="FlavioAliadosGuia" component={FlavioAliados} durationInFrames={QUADROS_FA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_FA, revisao: REVISAO_FA}} />
    <Composition id="FlavioAliadosLimpo" component={FlavioAliados} durationInFrames={QUADROS_FA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_FA, revisao: REVISAO_FA}} />
    <Still id="CapaFlavioAliados" component={CapaFlavioAliados} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OnibusEleicao" component={OnibusEleicao} durationInFrames={QUADROS_OE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_OE, revisao: REVISAO_OE}} />
    <Composition id="OnibusEleicaoGuia" component={OnibusEleicao} durationInFrames={QUADROS_OE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_OE, revisao: REVISAO_OE}} />
    <Composition id="OnibusEleicaoLimpo" component={OnibusEleicao} durationInFrames={QUADROS_OE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_OE, revisao: REVISAO_OE}} />
    <Still id="CapaOnibusEleicao" component={CapaOnibusEleicao} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="MudancasIlheus" component={MudancasIlheus} durationInFrames={QUADROS_MI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MI, revisao: REVISAO_MI}} />
    <Composition id="MudancasIlheusGuia" component={MudancasIlheus} durationInFrames={QUADROS_MI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MI, revisao: REVISAO_MI}} />
    <Composition id="MudancasIlheusLimpo" component={MudancasIlheus} durationInFrames={QUADROS_MI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MI, revisao: REVISAO_MI}} />
    <Still id="CapaMudancasIlheus" component={CapaMudancasIlheus} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="IlheusVolta" component={IlheusVolta} durationInFrames={QUADROS_IV} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_IV, revisao: REVISAO_IV}} />
    <Composition id="IlheusVoltaGuia" component={IlheusVolta} durationInFrames={QUADROS_IV} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_IV, revisao: REVISAO_IV}} />
    <Composition id="IlheusVoltaLimpo" component={IlheusVolta} durationInFrames={QUADROS_IV} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_IV, revisao: REVISAO_IV}} />
    <Still id="CapaIlheusVolta" component={CapaIlheusVolta} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="FabricaFake" component={FabricaFake} durationInFrames={QUADROS_FF} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_FF, revisao: REVISAO_FF}} />
    <Composition id="FabricaFakeGuia" component={FabricaFake} durationInFrames={QUADROS_FF} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_FF, revisao: REVISAO_FF}} />
    <Composition id="FabricaFakeLimpo" component={FabricaFake} durationInFrames={QUADROS_FF} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_FF, revisao: REVISAO_FF}} />
    <Still id="CapaFabricaFake" component={CapaFabricaFake} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="DemissaoVoto" component={DemissaoVoto} durationInFrames={QUADROS_DV} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_DV, revisao: REVISAO_DV}} />
    <Composition id="DemissaoVotoGuia" component={DemissaoVoto} durationInFrames={QUADROS_DV} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_DV, revisao: REVISAO_DV}} />
    <Composition id="DemissaoVotoLimpo" component={DemissaoVoto} durationInFrames={QUADROS_DV} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_DV, revisao: REVISAO_DV}} />
    <Still id="CapaDemissaoVoto" component={CapaDemissaoVoto} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="FakeIcms" component={FakeIcms} durationInFrames={QUADROS_FI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_FI, revisao: REVISAO_FI}} />
    <Composition id="FakeIcmsGuia" component={FakeIcms} durationInFrames={QUADROS_FI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_FI, revisao: REVISAO_FI}} />
    <Composition id="FakeIcmsLimpo" component={FakeIcms} durationInFrames={QUADROS_FI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_FI, revisao: REVISAO_FI}} />
    <Still id="CapaFakeIcms" component={CapaFakeIcms} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="DistritalMisto" component={DistritalMisto} durationInFrames={QUADROS_DM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_DM, revisao: REVISAO_DM}} />
    <Composition id="DistritalMistoGuia" component={DistritalMisto} durationInFrames={QUADROS_DM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_DM, revisao: REVISAO_DM}} />
    <Composition id="DistritalMistoLimpo" component={DistritalMisto} durationInFrames={QUADROS_DM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_DM, revisao: REVISAO_DM}} />
    <Still id="CapaDistritalMisto" component={CapaDistritalMisto} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="QuemDistrital" component={QuemDistrital} durationInFrames={QUADROS_QD} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_QD, revisao: REVISAO_QD}} />
    <Composition id="QuemDistritalGuia" component={QuemDistrital} durationInFrames={QUADROS_QD} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_QD, revisao: REVISAO_QD}} />
    <Composition id="QuemDistritalLimpo" component={QuemDistrital} durationInFrames={QUADROS_QD} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_QD, revisao: REVISAO_QD}} />
    <Still id="CapaQuemDistrital" component={CapaQuemDistrital} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
      <Composition id="ReformaTrib" component={ReformaTrib} durationInFrames={QUADROS_RTB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RTB, revisao: REVISAO_RTB}} />
      <Composition id="ReformaTribGuia" component={ReformaTrib} durationInFrames={QUADROS_RTB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RTB, revisao: REVISAO_RTB}} />
      <Composition id="ReformaTribLimpo" component={ReformaTrib} durationInFrames={QUADROS_RTB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RTB, revisao: REVISAO_RTB}} />
      <Still id="CapaReformaTrib" component={CapaReformaTrib} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
      <Composition id="PecSeguranca" component={PecSeguranca} durationInFrames={QUADROS_PS} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PS, revisao: REVISAO_PS}} />
      <Composition id="PecSegurancaGuia" component={PecSeguranca} durationInFrames={QUADROS_PS} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PS, revisao: REVISAO_PS}} />
      <Composition id="PecSegurancaLimpo" component={PecSeguranca} durationInFrames={QUADROS_PS} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PS, revisao: REVISAO_PS}} />
      <Still id="CapaPecSeguranca" component={CapaPecSeguranca} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="EleicaoEua" component={EleicaoEua} durationInFrames={QUADROS_EE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_EE, revisao: REVISAO_EE}} />
    <Composition id="EleicaoEuaGuia" component={EleicaoEua} durationInFrames={QUADROS_EE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_EE, revisao: REVISAO_EE}} />
    <Composition id="EleicaoEuaLimpo" component={EleicaoEua} durationInFrames={QUADROS_EE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_EE, revisao: REVISAO_EE}} />
    <Still id="CapaEleicaoEua" component={CapaEleicaoEua} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="MidtermsResultado" component={MidtermsResultado} durationInFrames={QUADROS_MR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MR, revisao: REVISAO_MR}} />
    <Composition id="MidtermsResultadoGuia" component={MidtermsResultado} durationInFrames={QUADROS_MR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MR, revisao: REVISAO_MR}} />
    <Composition id="MidtermsResultadoLimpo" component={MidtermsResultado} durationInFrames={QUADROS_MR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MR, revisao: REVISAO_MR}} />
    <Still id="CapaMidtermsResultado" component={CapaMidtermsResultado} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OnibusIlheus" component={OnibusIlheus} durationInFrames={QUADROS_ON} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ON, revisao: REVISAO_ON}} />
    <Composition id="OnibusIlheusGuia" component={OnibusIlheus} durationInFrames={QUADROS_ON} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ON, revisao: REVISAO_ON}} />
    <Composition id="OnibusIlheusLimpo" component={OnibusIlheus} durationInFrames={QUADROS_ON} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ON, revisao: REVISAO_ON}} />
    <Still id="CapaOnibusIlheus" component={CapaOnibusIlheus} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItabuna" component={OrcamentoItabuna} durationInFrames={QUADROS_OIT} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_OIT, revisao: REVISAO_OIT}} />
    <Composition id="OrcamentoItabunaGuia" component={OrcamentoItabuna} durationInFrames={QUADROS_OIT} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_OIT, revisao: REVISAO_OIT}} />
    <Composition id="OrcamentoItabunaLimpo" component={OrcamentoItabuna} durationInFrames={QUADROS_OIT} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_OIT, revisao: REVISAO_OIT}} />
    <Still id="CapaOrcamentoItabuna" component={CapaOrcamentoItabuna} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoUna" component={OrcamentoUna} durationInFrames={QUADROS_OUN} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_OUN, revisao: REVISAO_OUN}} />
    <Composition id="OrcamentoUnaGuia" component={OrcamentoUna} durationInFrames={QUADROS_OUN} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_OUN, revisao: REVISAO_OUN}} />
    <Composition id="OrcamentoUnaLimpo" component={OrcamentoUna} durationInFrames={QUADROS_OUN} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_OUN, revisao: REVISAO_OUN}} />
    <Still id="CapaOrcamentoUna" component={CapaOrcamentoUna} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSp" component={OrcamentoSp} durationInFrames={QUADROS_OSP} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_OSP, revisao: REVISAO_OSP}} />
    <Composition id="OrcamentoSpGuia" component={OrcamentoSp} durationInFrames={QUADROS_OSP} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_OSP, revisao: REVISAO_OSP}} />
    <Composition id="OrcamentoSpLimpo" component={OrcamentoSp} durationInFrames={QUADROS_OSP} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_OSP, revisao: REVISAO_OSP}} />
    <Still id="CapaOrcamentoSp" component={CapaOrcamentoSp} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoConquista" component={OrcamentoConquista} durationInFrames={QUADROS_QUISTA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_QUISTA, revisao: REVISAO_QUISTA}} />
    <Composition id="OrcamentoConquistaGuia" component={OrcamentoConquista} durationInFrames={QUADROS_QUISTA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_QUISTA, revisao: REVISAO_QUISTA}} />
    <Composition id="OrcamentoConquistaLimpo" component={OrcamentoConquista} durationInFrames={QUADROS_QUISTA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_QUISTA, revisao: REVISAO_QUISTA}} />
    <Still id="CapaOrcamentoConquista" component={CapaOrcamentoConquista} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSalvador" component={OrcamentoSalvador} durationInFrames={QUADROS_LVADOR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_LVADOR, revisao: REVISAO_LVADOR}} />
    <Composition id="OrcamentoSalvadorGuia" component={OrcamentoSalvador} durationInFrames={QUADROS_LVADOR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_LVADOR, revisao: REVISAO_LVADOR}} />
    <Composition id="OrcamentoSalvadorLimpo" component={OrcamentoSalvador} durationInFrames={QUADROS_LVADOR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_LVADOR, revisao: REVISAO_LVADOR}} />
    <Still id="CapaOrcamentoSalvador" component={CapaOrcamentoSalvador} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoPortoSeguro" component={OrcamentoPortoSeguro} durationInFrames={QUADROS_SEGURO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SEGURO, revisao: REVISAO_SEGURO}} />
    <Composition id="OrcamentoPortoSeguroGuia" component={OrcamentoPortoSeguro} durationInFrames={QUADROS_SEGURO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SEGURO, revisao: REVISAO_SEGURO}} />
    <Composition id="OrcamentoPortoSeguroLimpo" component={OrcamentoPortoSeguro} durationInFrames={QUADROS_SEGURO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SEGURO, revisao: REVISAO_SEGURO}} />
    <Still id="CapaOrcamentoPortoSeguro" component={CapaOrcamentoPortoSeguro} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoEunapolis" component={OrcamentoEunapolis} durationInFrames={QUADROS_EUN} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_EUN, revisao: REVISAO_EUN}} />
    <Composition id="OrcamentoEunapolisGuia" component={OrcamentoEunapolis} durationInFrames={QUADROS_EUN} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_EUN, revisao: REVISAO_EUN}} />
    <Composition id="OrcamentoEunapolisLimpo" component={OrcamentoEunapolis} durationInFrames={QUADROS_EUN} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_EUN, revisao: REVISAO_EUN}} />
    <Still id="CapaOrcamentoEunapolis" component={CapaOrcamentoEunapolis} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoBrumado" component={OrcamentoBrumado} durationInFrames={QUADROS_BRU} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BRU, revisao: REVISAO_BRU}} />
    <Composition id="OrcamentoBrumadoGuia" component={OrcamentoBrumado} durationInFrames={QUADROS_BRU} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BRU, revisao: REVISAO_BRU}} />
    <Composition id="OrcamentoBrumadoLimpo" component={OrcamentoBrumado} durationInFrames={QUADROS_BRU} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BRU, revisao: REVISAO_BRU}} />
    <Still id="CapaOrcamentoBrumado" component={CapaOrcamentoBrumado} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoFeira" component={OrcamentoFeira} durationInFrames={QUADROS_FEI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_FEI, revisao: REVISAO_FEI}} />
    <Composition id="OrcamentoFeiraGuia" component={OrcamentoFeira} durationInFrames={QUADROS_FEI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_FEI, revisao: REVISAO_FEI}} />
    <Composition id="OrcamentoFeiraLimpo" component={OrcamentoFeira} durationInFrames={QUADROS_FEI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_FEI, revisao: REVISAO_FEI}} />
    <Still id="CapaOrcamentoFeira" component={CapaOrcamentoFeira} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCoaraci" component={OrcamentoCoaraci} durationInFrames={QUADROS_COA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_COA, revisao: REVISAO_COA}} />
    <Composition id="OrcamentoCoaraciGuia" component={OrcamentoCoaraci} durationInFrames={QUADROS_COA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_COA, revisao: REVISAO_COA}} />
    <Composition id="OrcamentoCoaraciLimpo" component={OrcamentoCoaraci} durationInFrames={QUADROS_COA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_COA, revisao: REVISAO_COA}} />
    <Still id="CapaOrcamentoCoaraci" component={CapaOrcamentoCoaraci} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoBelmonte" component={OrcamentoBelmonte} durationInFrames={QUADROS_BEL} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BEL, revisao: REVISAO_BEL}} />
    <Composition id="OrcamentoBelmonteGuia" component={OrcamentoBelmonte} durationInFrames={QUADROS_BEL} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BEL, revisao: REVISAO_BEL}} />
    <Composition id="OrcamentoBelmonteLimpo" component={OrcamentoBelmonte} durationInFrames={QUADROS_BEL} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BEL, revisao: REVISAO_BEL}} />
    <Still id="CapaOrcamentoBelmonte" component={CapaOrcamentoBelmonte} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoInhambupe" component={OrcamentoInhambupe} durationInFrames={QUADROS_INH} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_INH, revisao: REVISAO_INH}} />
    <Composition id="OrcamentoInhambupeGuia" component={OrcamentoInhambupe} durationInFrames={QUADROS_INH} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_INH, revisao: REVISAO_INH}} />
    <Composition id="OrcamentoInhambupeLimpo" component={OrcamentoInhambupe} durationInFrames={QUADROS_INH} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_INH, revisao: REVISAO_INH}} />
    <Still id="CapaOrcamentoInhambupe" component={CapaOrcamentoInhambupe} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCanavieiras" component={OrcamentoCanavieiras} durationInFrames={QUADROS_CAN} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CAN, revisao: REVISAO_CAN}} />
    <Composition id="OrcamentoCanavieirasGuia" component={OrcamentoCanavieiras} durationInFrames={QUADROS_CAN} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CAN, revisao: REVISAO_CAN}} />
    <Composition id="OrcamentoCanavieirasLimpo" component={OrcamentoCanavieiras} durationInFrames={QUADROS_CAN} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CAN, revisao: REVISAO_CAN}} />
    <Still id="CapaOrcamentoCanavieiras" component={CapaOrcamentoCanavieiras} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoParatinga" component={OrcamentoParatinga} durationInFrames={QUADROS_PAR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PAR, revisao: REVISAO_PAR}} />
    <Composition id="OrcamentoParatingaGuia" component={OrcamentoParatinga} durationInFrames={QUADROS_PAR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PAR, revisao: REVISAO_PAR}} />
    <Composition id="OrcamentoParatingaLimpo" component={OrcamentoParatinga} durationInFrames={QUADROS_PAR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PAR, revisao: REVISAO_PAR}} />
    <Still id="CapaOrcamentoParatinga" component={CapaOrcamentoParatinga} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCabralia" component={OrcamentoCabralia} durationInFrames={QUADROS_CAB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CAB, revisao: REVISAO_CAB}} />
    <Composition id="OrcamentoCabraliaGuia" component={OrcamentoCabralia} durationInFrames={QUADROS_CAB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CAB, revisao: REVISAO_CAB}} />
    <Composition id="OrcamentoCabraliaLimpo" component={OrcamentoCabralia} durationInFrames={QUADROS_CAB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CAB, revisao: REVISAO_CAB}} />
    <Still id="CapaOrcamentoCabralia" component={CapaOrcamentoCabralia} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="ArrecadacaoBelmonte" component={ArrecadacaoBelmonte} durationInFrames={QUADROS_ARB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ARB, revisao: REVISAO_ARB}} />
    <Composition id="ArrecadacaoBelmonteGuia" component={ArrecadacaoBelmonte} durationInFrames={QUADROS_ARB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ARB, revisao: REVISAO_ARB}} />
    <Composition id="ArrecadacaoBelmonteLimpo" component={ArrecadacaoBelmonte} durationInFrames={QUADROS_ARB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ARB, revisao: REVISAO_ARB}} />
    <Still id="CapaArrecadacaoBelmonte" component={CapaArrecadacaoBelmonte} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCamacari" component={OrcamentoCamacari} durationInFrames={QUADROS_CMC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CMC, revisao: REVISAO_CMC}} />
    <Composition id="OrcamentoCamacariGuia" component={OrcamentoCamacari} durationInFrames={QUADROS_CMC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CMC, revisao: REVISAO_CMC}} />
    <Composition id="OrcamentoCamacariLimpo" component={OrcamentoCamacari} durationInFrames={QUADROS_CMC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CMC, revisao: REVISAO_CMC}} />
    <Still id="CapaOrcamentoCamacari" component={CapaOrcamentoCamacari} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItajuipe" component={OrcamentoItajuipe} durationInFrames={QUADROS_ITJ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITJ, revisao: REVISAO_ITJ}} />
    <Composition id="OrcamentoItajuipeGuia" component={OrcamentoItajuipe} durationInFrames={QUADROS_ITJ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITJ, revisao: REVISAO_ITJ}} />
    <Composition id="OrcamentoItajuipeLimpo" component={OrcamentoItajuipe} durationInFrames={QUADROS_ITJ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITJ, revisao: REVISAO_ITJ}} />
    <Still id="CapaOrcamentoItajuipe" component={CapaOrcamentoItajuipe} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItapitanga" component={OrcamentoItapitanga} durationInFrames={QUADROS_ITP} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITP, revisao: REVISAO_ITP}} />
    <Composition id="OrcamentoItapitangaGuia" component={OrcamentoItapitanga} durationInFrames={QUADROS_ITP} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITP, revisao: REVISAO_ITP}} />
    <Composition id="OrcamentoItapitangaLimpo" component={OrcamentoItapitanga} durationInFrames={QUADROS_ITP} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITP, revisao: REVISAO_ITP}} />
    <Still id="CapaOrcamentoItapitanga" component={CapaOrcamentoItapitanga} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoLivramento" component={OrcamentoLivramento} durationInFrames={QUADROS_LIV} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_LIV, revisao: REVISAO_LIV}} />
    <Composition id="OrcamentoLivramentoGuia" component={OrcamentoLivramento} durationInFrames={QUADROS_LIV} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_LIV, revisao: REVISAO_LIV}} />
    <Composition id="OrcamentoLivramentoLimpo" component={OrcamentoLivramento} durationInFrames={QUADROS_LIV} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_LIV, revisao: REVISAO_LIV}} />
    <Still id="CapaOrcamentoLivramento" component={CapaOrcamentoLivramento} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoGuanambi" component={OrcamentoGuanambi} durationInFrames={QUADROS_GUA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_GUA, revisao: REVISAO_GUA}} />
    <Composition id="OrcamentoGuanambiGuia" component={OrcamentoGuanambi} durationInFrames={QUADROS_GUA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_GUA, revisao: REVISAO_GUA}} />
    <Composition id="OrcamentoGuanambiLimpo" component={OrcamentoGuanambi} durationInFrames={QUADROS_GUA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_GUA, revisao: REVISAO_GUA}} />
    <Still id="CapaOrcamentoGuanambi" component={CapaOrcamentoGuanambi} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoAnage" component={OrcamentoAnage} durationInFrames={QUADROS_ANA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ANA, revisao: REVISAO_ANA}} />
    <Composition id="OrcamentoAnageGuia" component={OrcamentoAnage} durationInFrames={QUADROS_ANA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ANA, revisao: REVISAO_ANA}} />
    <Composition id="OrcamentoAnageLimpo" component={OrcamentoAnage} durationInFrames={QUADROS_ANA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ANA, revisao: REVISAO_ANA}} />
    <Still id="CapaOrcamentoAnage" component={CapaOrcamentoAnage} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoPotiragua" component={OrcamentoPotiragua} durationInFrames={QUADROS_POT} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_POT, revisao: REVISAO_POT}} />
    <Composition id="OrcamentoPotiraguaGuia" component={OrcamentoPotiragua} durationInFrames={QUADROS_POT} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_POT, revisao: REVISAO_POT}} />
    <Composition id="OrcamentoPotiraguaLimpo" component={OrcamentoPotiragua} durationInFrames={QUADROS_POT} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_POT, revisao: REVISAO_POT}} />
    <Still id="CapaOrcamentoPotiragua" component={CapaOrcamentoPotiragua} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCairu" component={OrcamentoCairu} durationInFrames={QUADROS_CAI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CAI, revisao: REVISAO_CAI}} />
    <Composition id="OrcamentoCairuGuia" component={OrcamentoCairu} durationInFrames={QUADROS_CAI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CAI, revisao: REVISAO_CAI}} />
    <Composition id="OrcamentoCairuLimpo" component={OrcamentoCairu} durationInFrames={QUADROS_CAI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CAI, revisao: REVISAO_CAI}} />
    <Still id="CapaOrcamentoCairu" component={CapaOrcamentoCairu} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItapetinga" component={OrcamentoItapetinga} durationInFrames={QUADROS_ITG} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITG, revisao: REVISAO_ITG}} />
    <Composition id="OrcamentoItapetingaGuia" component={OrcamentoItapetinga} durationInFrames={QUADROS_ITG} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITG, revisao: REVISAO_ITG}} />
    <Composition id="OrcamentoItapetingaLimpo" component={OrcamentoItapetinga} durationInFrames={QUADROS_ITG} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITG, revisao: REVISAO_ITG}} />
    <Still id="CapaOrcamentoItapetinga" component={CapaOrcamentoItapetinga} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoIbicarai" component={OrcamentoIbicarai} durationInFrames={QUADROS_IBI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_IBI, revisao: REVISAO_IBI}} />
    <Composition id="OrcamentoIbicaraiGuia" component={OrcamentoIbicarai} durationInFrames={QUADROS_IBI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_IBI, revisao: REVISAO_IBI}} />
    <Composition id="OrcamentoIbicaraiLimpo" component={OrcamentoIbicarai} durationInFrames={QUADROS_IBI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_IBI, revisao: REVISAO_IBI}} />
    <Still id="CapaOrcamentoIbicarai" component={CapaOrcamentoIbicarai} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCamacan" component={OrcamentoCamacan} durationInFrames={QUADROS_CMN} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CMN, revisao: REVISAO_CMN}} />
    <Composition id="OrcamentoCamacanGuia" component={OrcamentoCamacan} durationInFrames={QUADROS_CMN} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CMN, revisao: REVISAO_CMN}} />
    <Composition id="OrcamentoCamacanLimpo" component={OrcamentoCamacan} durationInFrames={QUADROS_CMN} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CMN, revisao: REVISAO_CMN}} />
    <Still id="CapaOrcamentoCamacan" component={CapaOrcamentoCamacan} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoUbaitaba" component={OrcamentoUbaitaba} durationInFrames={QUADROS_UBT} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_UBT, revisao: REVISAO_UBT}} />
    <Composition id="OrcamentoUbaitabaGuia" component={OrcamentoUbaitaba} durationInFrames={QUADROS_UBT} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_UBT, revisao: REVISAO_UBT}} />
    <Composition id="OrcamentoUbaitabaLimpo" component={OrcamentoUbaitaba} durationInFrames={QUADROS_UBT} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_UBT, revisao: REVISAO_UBT}} />
    <Still id="CapaOrcamentoUbaitaba" component={CapaOrcamentoUbaitaba} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoParatinga1824" component={OrcamentoParatinga1824} durationInFrames={QUADROS_PAR1824} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PAR1824, revisao: REVISAO_PAR1824}} />
    <Composition id="OrcamentoParatinga1824Guia" component={OrcamentoParatinga1824} durationInFrames={QUADROS_PAR1824} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PAR1824, revisao: REVISAO_PAR1824}} />
    <Composition id="OrcamentoParatinga1824Limpo" component={OrcamentoParatinga1824} durationInFrames={QUADROS_PAR1824} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PAR1824, revisao: REVISAO_PAR1824}} />
    <Still id="CapaOrcamentoParatinga1824" component={CapaOrcamentoParatinga1824} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="ObrasIlheus10" component={ObrasIlheus10} durationInFrames={QUADROS_OI10} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_OI10, revisao: REVISAO_OI10}} />
    <Composition id="ObrasIlheus10Guia" component={ObrasIlheus10} durationInFrames={QUADROS_OI10} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_OI10, revisao: REVISAO_OI10}} />
    <Composition id="ObrasIlheus10Limpo" component={ObrasIlheus10} durationInFrames={QUADROS_OI10} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_OI10, revisao: REVISAO_OI10}} />
    <Still id="CapaObrasIlheus10" component={CapaObrasIlheus10} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="SaudeIlheus10" component={SaudeIlheus10} durationInFrames={QUADROS_SI10} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SI10, revisao: REVISAO_SI10}} />
    <Composition id="SaudeIlheus10Guia" component={SaudeIlheus10} durationInFrames={QUADROS_SI10} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SI10, revisao: REVISAO_SI10}} />
    <Composition id="SaudeIlheus10Limpo" component={SaudeIlheus10} durationInFrames={QUADROS_SI10} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SI10, revisao: REVISAO_SI10}} />
    <Still id="CapaSaudeIlheus10" component={CapaSaudeIlheus10} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="ParatingaSetores1824" component={ParatingaSetores1824} durationInFrames={QUADROS_PS1824} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PS1824, revisao: REVISAO_PS1824}} />
    <Composition id="ParatingaSetores1824Guia" component={ParatingaSetores1824} durationInFrames={QUADROS_PS1824} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PS1824, revisao: REVISAO_PS1824}} />
    <Composition id="ParatingaSetores1824Limpo" component={ParatingaSetores1824} durationInFrames={QUADROS_PS1824} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PS1824, revisao: REVISAO_PS1824}} />
    <Still id="CapaParatingaSetores1824" component={CapaParatingaSetores1824} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoAlmadina" component={OrcamentoAlmadina} durationInFrames={QUADROS_ALM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ALM, revisao: REVISAO_ALM}} />
    <Composition id="OrcamentoAlmadinaGuia" component={OrcamentoAlmadina} durationInFrames={QUADROS_ALM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ALM, revisao: REVISAO_ALM}} />
    <Composition id="OrcamentoAlmadinaLimpo" component={OrcamentoAlmadina} durationInFrames={QUADROS_ALM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ALM, revisao: REVISAO_ALM}} />
    <Still id="CapaOrcamentoAlmadina" component={CapaOrcamentoAlmadina} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoNovaVicosa" component={OrcamentoNovaVicosa} durationInFrames={QUADROS_NVI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_NVI, revisao: REVISAO_NVI}} />
    <Composition id="OrcamentoNovaVicosaGuia" component={OrcamentoNovaVicosa} durationInFrames={QUADROS_NVI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_NVI, revisao: REVISAO_NVI}} />
    <Composition id="OrcamentoNovaVicosaLimpo" component={OrcamentoNovaVicosa} durationInFrames={QUADROS_NVI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_NVI, revisao: REVISAO_NVI}} />
    <Still id="CapaOrcamentoNovaVicosa" component={CapaOrcamentoNovaVicosa} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoMucuri" component={OrcamentoMucuri} durationInFrames={QUADROS_MUC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MUC, revisao: REVISAO_MUC}} />
    <Composition id="OrcamentoMucuriGuia" component={OrcamentoMucuri} durationInFrames={QUADROS_MUC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MUC, revisao: REVISAO_MUC}} />
    <Composition id="OrcamentoMucuriLimpo" component={OrcamentoMucuri} durationInFrames={QUADROS_MUC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MUC, revisao: REVISAO_MUC}} />
    <Still id="CapaOrcamentoMucuri" component={CapaOrcamentoMucuri} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoValenca" component={OrcamentoValenca} durationInFrames={QUADROS_VAL} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_VAL, revisao: REVISAO_VAL}} />
    <Composition id="OrcamentoValencaGuia" component={OrcamentoValenca} durationInFrames={QUADROS_VAL} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_VAL, revisao: REVISAO_VAL}} />
    <Composition id="OrcamentoValencaLimpo" component={OrcamentoValenca} durationInFrames={QUADROS_VAL} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_VAL, revisao: REVISAO_VAL}} />
    <Still id="CapaOrcamentoValenca" component={CapaOrcamentoValenca} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItubera" component={OrcamentoItubera} durationInFrames={QUADROS_ITU} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITU, revisao: REVISAO_ITU}} />
    <Composition id="OrcamentoItuberaGuia" component={OrcamentoItubera} durationInFrames={QUADROS_ITU} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITU, revisao: REVISAO_ITU}} />
    <Composition id="OrcamentoItuberaLimpo" component={OrcamentoItubera} durationInFrames={QUADROS_ITU} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITU, revisao: REVISAO_ITU}} />
    <Still id="CapaOrcamentoItubera" component={CapaOrcamentoItubera} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSeabra" component={OrcamentoSeabra} durationInFrames={QUADROS_SEA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SEA, revisao: REVISAO_SEA}} />
    <Composition id="OrcamentoSeabraGuia" component={OrcamentoSeabra} durationInFrames={QUADROS_SEA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SEA, revisao: REVISAO_SEA}} />
    <Composition id="OrcamentoSeabraLimpo" component={OrcamentoSeabra} durationInFrames={QUADROS_SEA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SEA, revisao: REVISAO_SEA}} />
    <Still id="CapaOrcamentoSeabra" component={CapaOrcamentoSeabra} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoParamirim" component={OrcamentoParamirim} durationInFrames={QUADROS_PMI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PMI, revisao: REVISAO_PMI}} />
    <Composition id="OrcamentoParamirimGuia" component={OrcamentoParamirim} durationInFrames={QUADROS_PMI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PMI, revisao: REVISAO_PMI}} />
    <Composition id="OrcamentoParamirimLimpo" component={OrcamentoParamirim} durationInFrames={QUADROS_PMI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PMI, revisao: REVISAO_PMI}} />
    <Still id="CapaOrcamentoParamirim" component={CapaOrcamentoParamirim} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItambe" component={OrcamentoItambe} durationInFrames={QUADROS_IBE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_IBE, revisao: REVISAO_IBE}} />
    <Composition id="OrcamentoItambeGuia" component={OrcamentoItambe} durationInFrames={QUADROS_IBE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_IBE, revisao: REVISAO_IBE}} />
    <Composition id="OrcamentoItambeLimpo" component={OrcamentoItambe} durationInFrames={QUADROS_IBE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_IBE, revisao: REVISAO_IBE}} />
    <Still id="CapaOrcamentoItambe" component={CapaOrcamentoItambe} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoIlheusTcm" component={OrcamentoIlheusTcm} durationInFrames={QUADROS_ILT} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ILT, revisao: REVISAO_ILT}} />
    <Composition id="OrcamentoIlheusTcmGuia" component={OrcamentoIlheusTcm} durationInFrames={QUADROS_ILT} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ILT, revisao: REVISAO_ILT}} />
    <Composition id="OrcamentoIlheusTcmLimpo" component={OrcamentoIlheusTcm} durationInFrames={QUADROS_ILT} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ILT, revisao: REVISAO_ILT}} />
    <Still id="CapaOrcamentoIlheusTcm" component={CapaOrcamentoIlheusTcm} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoBarroPreto" component={OrcamentoBarroPreto} durationInFrames={QUADROS_BPR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BPR, revisao: REVISAO_BPR}} />
    <Composition id="OrcamentoBarroPretoGuia" component={OrcamentoBarroPreto} durationInFrames={QUADROS_BPR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BPR, revisao: REVISAO_BPR}} />
    <Composition id="OrcamentoBarroPretoLimpo" component={OrcamentoBarroPreto} durationInFrames={QUADROS_BPR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BPR, revisao: REVISAO_BPR}} />
    <Still id="CapaOrcamentoBarroPreto" component={CapaOrcamentoBarroPreto} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCaetite" component={OrcamentoCaetite} durationInFrames={QUADROS_CAE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CAE, revisao: REVISAO_CAE}} />
    <Composition id="OrcamentoCaetiteGuia" component={OrcamentoCaetite} durationInFrames={QUADROS_CAE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CAE, revisao: REVISAO_CAE}} />
    <Composition id="OrcamentoCaetiteLimpo" component={OrcamentoCaetite} durationInFrames={QUADROS_CAE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CAE, revisao: REVISAO_CAE}} />
    <Still id="CapaOrcamentoCaetite" component={CapaOrcamentoCaetite} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCandidoSales" component={OrcamentoCandidoSales} durationInFrames={QUADROS_CSA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CSA, revisao: REVISAO_CSA}} />
    <Composition id="OrcamentoCandidoSalesGuia" component={OrcamentoCandidoSales} durationInFrames={QUADROS_CSA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CSA, revisao: REVISAO_CSA}} />
    <Composition id="OrcamentoCandidoSalesLimpo" component={OrcamentoCandidoSales} durationInFrames={QUADROS_CSA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CSA, revisao: REVISAO_CSA}} />
    <Still id="CapaOrcamentoCandidoSales" component={CapaOrcamentoCandidoSales} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCaravelas" component={OrcamentoCaravelas} durationInFrames={QUADROS_CRV} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CRV, revisao: REVISAO_CRV}} />
    <Composition id="OrcamentoCaravelasGuia" component={OrcamentoCaravelas} durationInFrames={QUADROS_CRV} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CRV, revisao: REVISAO_CRV}} />
    <Composition id="OrcamentoCaravelasLimpo" component={OrcamentoCaravelas} durationInFrames={QUADROS_CRV} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CRV, revisao: REVISAO_CRV}} />
    <Still id="CapaOrcamentoCaravelas" component={CapaOrcamentoCaravelas} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItabela" component={OrcamentoItabela} durationInFrames={QUADROS_ITB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITB, revisao: REVISAO_ITB}} />
    <Composition id="OrcamentoItabelaGuia" component={OrcamentoItabela} durationInFrames={QUADROS_ITB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITB, revisao: REVISAO_ITB}} />
    <Composition id="OrcamentoItabelaLimpo" component={OrcamentoItabela} durationInFrames={QUADROS_ITB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITB, revisao: REVISAO_ITB}} />
    <Still id="CapaOrcamentoItabela" component={CapaOrcamentoItabela} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItacare" component={OrcamentoItacare} durationInFrames={QUADROS_ITC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITC, revisao: REVISAO_ITC}} />
    <Composition id="OrcamentoItacareGuia" component={OrcamentoItacare} durationInFrames={QUADROS_ITC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITC, revisao: REVISAO_ITC}} />
    <Composition id="OrcamentoItacareLimpo" component={OrcamentoItacare} durationInFrames={QUADROS_ITC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITC, revisao: REVISAO_ITC}} />
    <Still id="CapaOrcamentoItacare" component={CapaOrcamentoItacare} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoJequie" component={OrcamentoJequie} durationInFrames={QUADROS_JEQ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_JEQ, revisao: REVISAO_JEQ}} />
    <Composition id="OrcamentoJequieGuia" component={OrcamentoJequie} durationInFrames={QUADROS_JEQ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_JEQ, revisao: REVISAO_JEQ}} />
    <Composition id="OrcamentoJequieLimpo" component={OrcamentoJequie} durationInFrames={QUADROS_JEQ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_JEQ, revisao: REVISAO_JEQ}} />
    <Still id="CapaOrcamentoJequie" component={CapaOrcamentoJequie} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoUrucuca" component={OrcamentoUrucuca} durationInFrames={QUADROS_URU} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_URU, revisao: REVISAO_URU}} />
    <Composition id="OrcamentoUrucucaGuia" component={OrcamentoUrucuca} durationInFrames={QUADROS_URU} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_URU, revisao: REVISAO_URU}} />
    <Composition id="OrcamentoUrucucaLimpo" component={OrcamentoUrucuca} durationInFrames={QUADROS_URU} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_URU, revisao: REVISAO_URU}} />
    <Still id="CapaOrcamentoUrucuca" component={CapaOrcamentoUrucuca} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoBomJesus" component={OrcamentoBomJesus} durationInFrames={QUADROS_BJL} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BJL, revisao: REVISAO_BJL}} />
    <Composition id="OrcamentoBomJesusGuia" component={OrcamentoBomJesus} durationInFrames={QUADROS_BJL} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BJL, revisao: REVISAO_BJL}} />
    <Composition id="OrcamentoBomJesusLimpo" component={OrcamentoBomJesus} durationInFrames={QUADROS_BJL} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BJL, revisao: REVISAO_BJL}} />
    <Still id="CapaOrcamentoBomJesus" component={CapaOrcamentoBomJesus} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoLauro" component={OrcamentoLauro} durationInFrames={QUADROS_LDF} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_LDF, revisao: REVISAO_LDF}} />
    <Composition id="OrcamentoLauroGuia" component={OrcamentoLauro} durationInFrames={QUADROS_LDF} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_LDF, revisao: REVISAO_LDF}} />
    <Composition id="OrcamentoLauroLimpo" component={OrcamentoLauro} durationInFrames={QUADROS_LDF} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_LDF, revisao: REVISAO_LDF}} />
    <Still id="CapaOrcamentoLauro" component={CapaOrcamentoLauro} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoTeixeira" component={OrcamentoTeixeira} durationInFrames={QUADROS_TXF} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_TXF, revisao: REVISAO_TXF}} />
    <Composition id="OrcamentoTeixeiraGuia" component={OrcamentoTeixeira} durationInFrames={QUADROS_TXF} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_TXF, revisao: REVISAO_TXF}} />
    <Composition id="OrcamentoTeixeiraLimpo" component={OrcamentoTeixeira} durationInFrames={QUADROS_TXF} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_TXF, revisao: REVISAO_TXF}} />
    <Still id="CapaOrcamentoTeixeira" component={CapaOrcamentoTeixeira} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoLem" component={OrcamentoLem} durationInFrames={QUADROS_LEM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_LEM, revisao: REVISAO_LEM}} />
    <Composition id="OrcamentoLemGuia" component={OrcamentoLem} durationInFrames={QUADROS_LEM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_LEM, revisao: REVISAO_LEM}} />
    <Composition id="OrcamentoLemLimpo" component={OrcamentoLem} durationInFrames={QUADROS_LEM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_LEM, revisao: REVISAO_LEM}} />
    <Still id="CapaOrcamentoLem" component={CapaOrcamentoLem} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoRioDeContas" component={OrcamentoRioDeContas} durationInFrames={QUADROS_RDC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RDC, revisao: REVISAO_RDC}} />
    <Composition id="OrcamentoRioDeContasGuia" component={OrcamentoRioDeContas} durationInFrames={QUADROS_RDC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RDC, revisao: REVISAO_RDC}} />
    <Composition id="OrcamentoRioDeContasLimpo" component={OrcamentoRioDeContas} durationInFrames={QUADROS_RDC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RDC, revisao: REVISAO_RDC}} />
    <Still id="CapaOrcamentoRioDeContas" component={CapaOrcamentoRioDeContas} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoRioDeContasV2" component={OrcamentoRioDeContasV2} durationInFrames={QUADROS_RDC2} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RDC2, revisao: REVISAO_RDC2}} />
    <Composition id="OrcamentoRioDeContasV2Guia" component={OrcamentoRioDeContasV2} durationInFrames={QUADROS_RDC2} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RDC2, revisao: REVISAO_RDC2}} />
    <Composition id="OrcamentoRioDeContasV2Limpo" component={OrcamentoRioDeContasV2} durationInFrames={QUADROS_RDC2} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RDC2, revisao: REVISAO_RDC2}} />
    <Still id="CapaOrcamentoRioDeContasV2" component={CapaOrcamentoRioDeContasV2} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoBarreiras" component={OrcamentoBarreiras} durationInFrames={QUADROS_BAR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BAR, revisao: REVISAO_BAR}} />
    <Composition id="OrcamentoBarreirasGuia" component={OrcamentoBarreiras} durationInFrames={QUADROS_BAR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BAR, revisao: REVISAO_BAR}} />
    <Composition id="OrcamentoBarreirasLimpo" component={OrcamentoBarreiras} durationInFrames={QUADROS_BAR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BAR, revisao: REVISAO_BAR}} />
    <Still id="CapaOrcamentoBarreiras" component={CapaOrcamentoBarreiras} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItamaraju" component={OrcamentoItamaraju} durationInFrames={QUADROS_ITA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITA, revisao: REVISAO_ITA}} />
    <Composition id="OrcamentoItamarajuGuia" component={OrcamentoItamaraju} durationInFrames={QUADROS_ITA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITA, revisao: REVISAO_ITA}} />
    <Composition id="OrcamentoItamarajuLimpo" component={OrcamentoItamaraju} durationInFrames={QUADROS_ITA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITA, revisao: REVISAO_ITA}} />
    <Still id="CapaOrcamentoItamaraju" component={CapaOrcamentoItamaraju} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSimoesFilho" component={OrcamentoSimoesFilho} durationInFrames={QUADROS_SIM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SIM, revisao: REVISAO_SIM}} />
    <Composition id="OrcamentoSimoesFilhoGuia" component={OrcamentoSimoesFilho} durationInFrames={QUADROS_SIM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SIM, revisao: REVISAO_SIM}} />
    <Composition id="OrcamentoSimoesFilhoLimpo" component={OrcamentoSimoesFilho} durationInFrames={QUADROS_SIM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SIM, revisao: REVISAO_SIM}} />
    <Still id="CapaOrcamentoSimoesFilho" component={CapaOrcamentoSimoesFilho} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoDarioMeira" component={OrcamentoDarioMeira} durationInFrames={QUADROS_DME} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_DME, revisao: REVISAO_DME}} />
    <Composition id="OrcamentoDarioMeiraGuia" component={OrcamentoDarioMeira} durationInFrames={QUADROS_DME} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_DME, revisao: REVISAO_DME}} />
    <Composition id="OrcamentoDarioMeiraLimpo" component={OrcamentoDarioMeira} durationInFrames={QUADROS_DME} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_DME, revisao: REVISAO_DME}} />
    <Still id="CapaOrcamentoDarioMeira" component={CapaOrcamentoDarioMeira} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="EducacaoIlheus10" component={EducacaoIlheus10} durationInFrames={QUADROS_EDI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_EDI, revisao: REVISAO_EDI}} />
    <Composition id="EducacaoIlheus10Guia" component={EducacaoIlheus10} durationInFrames={QUADROS_EDI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_EDI, revisao: REVISAO_EDI}} />
    <Composition id="EducacaoIlheus10Limpo" component={EducacaoIlheus10} durationInFrames={QUADROS_EDI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_EDI, revisao: REVISAO_EDI}} />
    <Still id="CapaEducacaoIlheus10" component={CapaEducacaoIlheus10} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoIlheus" component={OrcamentoIlheus} durationInFrames={QUADROS_OI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_OI, revisao: REVISAO_OI}} />
    <Composition id="OrcamentoIlheusGuia" component={OrcamentoIlheus} durationInFrames={QUADROS_OI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_OI, revisao: REVISAO_OI}} />
    <Composition id="OrcamentoIlheusLimpo" component={OrcamentoIlheus} durationInFrames={QUADROS_OI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_OI, revisao: REVISAO_OI}} />
    <Still id="CapaOrcamentoIlheus" component={CapaOrcamentoIlheus} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoGandu" component={OrcamentoGandu} durationInFrames={QUADROS_GND} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_GND, revisao: REVISAO_GND}} />
    <Composition id="OrcamentoGanduGuia" component={OrcamentoGandu} durationInFrames={QUADROS_GND} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_GND, revisao: REVISAO_GND}} />
    <Composition id="OrcamentoGanduLimpo" component={OrcamentoGandu} durationInFrames={QUADROS_GND} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_GND, revisao: REVISAO_GND}} />
    <Still id="CapaOrcamentoGandu" component={CapaOrcamentoGandu} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoMacaubas" component={OrcamentoMacaubas} durationInFrames={QUADROS_MCB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MCB, revisao: REVISAO_MCB}} />
    <Composition id="OrcamentoMacaubasGuia" component={OrcamentoMacaubas} durationInFrames={QUADROS_MCB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MCB, revisao: REVISAO_MCB}} />
    <Composition id="OrcamentoMacaubasLimpo" component={OrcamentoMacaubas} durationInFrames={QUADROS_MCB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MCB, revisao: REVISAO_MCB}} />
    <Still id="CapaOrcamentoMacaubas" component={CapaOrcamentoMacaubas} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoMataDeSaoJoao" component={OrcamentoMataDeSaoJoao} durationInFrames={QUADROS_MSJ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MSJ, revisao: REVISAO_MSJ}} />
    <Composition id="OrcamentoMataDeSaoJoaoGuia" component={OrcamentoMataDeSaoJoao} durationInFrames={QUADROS_MSJ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MSJ, revisao: REVISAO_MSJ}} />
    <Composition id="OrcamentoMataDeSaoJoaoLimpo" component={OrcamentoMataDeSaoJoao} durationInFrames={QUADROS_MSJ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MSJ, revisao: REVISAO_MSJ}} />
    <Still id="CapaOrcamentoMataDeSaoJoao" component={CapaOrcamentoMataDeSaoJoao} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoNazare" component={OrcamentoNazare} durationInFrames={QUADROS_NAZ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_NAZ, revisao: REVISAO_NAZ}} />
    <Composition id="OrcamentoNazareGuia" component={OrcamentoNazare} durationInFrames={QUADROS_NAZ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_NAZ, revisao: REVISAO_NAZ}} />
    <Composition id="OrcamentoNazareLimpo" component={OrcamentoNazare} durationInFrames={QUADROS_NAZ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_NAZ, revisao: REVISAO_NAZ}} />
    <Still id="CapaOrcamentoNazare" component={CapaOrcamentoNazare} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoBuerarema" component={OrcamentoBuerarema} durationInFrames={QUADROS_BUE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BUE, revisao: REVISAO_BUE}} />
    <Composition id="OrcamentoBueraremaGuia" component={OrcamentoBuerarema} durationInFrames={QUADROS_BUE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BUE, revisao: REVISAO_BUE}} />
    <Composition id="OrcamentoBueraremaLimpo" component={OrcamentoBuerarema} durationInFrames={QUADROS_BUE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BUE, revisao: REVISAO_BUE}} />
    <Still id="CapaOrcamentoBuerarema" component={CapaOrcamentoBuerarema} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoFlorestaAzul" component={OrcamentoFlorestaAzul} durationInFrames={QUADROS_FLA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_FLA, revisao: REVISAO_FLA}} />
    <Composition id="OrcamentoFlorestaAzulGuia" component={OrcamentoFlorestaAzul} durationInFrames={QUADROS_FLA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_FLA, revisao: REVISAO_FLA}} />
    <Composition id="OrcamentoFlorestaAzulLimpo" component={OrcamentoFlorestaAzul} durationInFrames={QUADROS_FLA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_FLA, revisao: REVISAO_FLA}} />
    <Still id="CapaOrcamentoFlorestaAzul" component={CapaOrcamentoFlorestaAzul} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoGuaratinga" component={OrcamentoGuaratinga} durationInFrames={QUADROS_GRT} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_GRT, revisao: REVISAO_GRT}} />
    <Composition id="OrcamentoGuaratingaGuia" component={OrcamentoGuaratinga} durationInFrames={QUADROS_GRT} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_GRT, revisao: REVISAO_GRT}} />
    <Composition id="OrcamentoGuaratingaLimpo" component={OrcamentoGuaratinga} durationInFrames={QUADROS_GRT} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_GRT, revisao: REVISAO_GRT}} />
    <Still id="CapaOrcamentoGuaratinga" component={CapaOrcamentoGuaratinga} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoIbirataia" component={OrcamentoIbirataia} durationInFrames={QUADROS_IBR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_IBR, revisao: REVISAO_IBR}} />
    <Composition id="OrcamentoIbirataiaGuia" component={OrcamentoIbirataia} durationInFrames={QUADROS_IBR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_IBR, revisao: REVISAO_IBR}} />
    <Composition id="OrcamentoIbirataiaLimpo" component={OrcamentoIbirataia} durationInFrames={QUADROS_IBR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_IBR, revisao: REVISAO_IBR}} />
    <Still id="CapaOrcamentoIbirataia" component={CapaOrcamentoIbirataia} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItagiba" component={OrcamentoItagiba} durationInFrames={QUADROS_ITGB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITGB, revisao: REVISAO_ITGB}} />
    <Composition id="OrcamentoItagibaGuia" component={OrcamentoItagiba} durationInFrames={QUADROS_ITGB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITGB, revisao: REVISAO_ITGB}} />
    <Composition id="OrcamentoItagibaLimpo" component={OrcamentoItagiba} durationInFrames={QUADROS_ITGB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITGB, revisao: REVISAO_ITGB}} />
    <Still id="CapaOrcamentoItagiba" component={CapaOrcamentoItagiba} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItajuDoColonia" component={OrcamentoItajuDoColonia} durationInFrames={QUADROS_ITJC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITJC, revisao: REVISAO_ITJC}} />
    <Composition id="OrcamentoItajuDoColoniaGuia" component={OrcamentoItajuDoColonia} durationInFrames={QUADROS_ITJC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITJC, revisao: REVISAO_ITJC}} />
    <Composition id="OrcamentoItajuDoColoniaLimpo" component={OrcamentoItajuDoColonia} durationInFrames={QUADROS_ITJC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITJC, revisao: REVISAO_ITJC}} />
    <Still id="CapaOrcamentoItajuDoColonia" component={CapaOrcamentoItajuDoColonia} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItapebi" component={OrcamentoItapebi} durationInFrames={QUADROS_ITPB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITPB, revisao: REVISAO_ITPB}} />
    <Composition id="OrcamentoItapebiGuia" component={OrcamentoItapebi} durationInFrames={QUADROS_ITPB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITPB, revisao: REVISAO_ITPB}} />
    <Composition id="OrcamentoItapebiLimpo" component={OrcamentoItapebi} durationInFrames={QUADROS_ITPB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITPB, revisao: REVISAO_ITPB}} />
    <Still id="CapaOrcamentoItapebi" component={CapaOrcamentoItapebi} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoMascote" component={OrcamentoMascote} durationInFrames={QUADROS_MSC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MSC, revisao: REVISAO_MSC}} />
    <Composition id="OrcamentoMascoteGuia" component={OrcamentoMascote} durationInFrames={QUADROS_MSC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MSC, revisao: REVISAO_MSC}} />
    <Composition id="OrcamentoMascoteLimpo" component={OrcamentoMascote} durationInFrames={QUADROS_MSC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MSC, revisao: REVISAO_MSC}} />
    <Still id="CapaOrcamentoMascote" component={CapaOrcamentoMascote} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoUbata" component={OrcamentoUbata} durationInFrames={QUADROS_UBTA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_UBTA, revisao: REVISAO_UBTA}} />
    <Composition id="OrcamentoUbataGuia" component={OrcamentoUbata} durationInFrames={QUADROS_UBTA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_UBTA, revisao: REVISAO_UBTA}} />
    <Composition id="OrcamentoUbataLimpo" component={OrcamentoUbata} durationInFrames={QUADROS_UBTA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_UBTA, revisao: REVISAO_UBTA}} />
    <Still id="CapaOrcamentoUbata" component={CapaOrcamentoUbata} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoTancredoNeves" component={OrcamentoTancredoNeves} durationInFrames={QUADROS_PTN} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PTN, revisao: REVISAO_PTN}} />
    <Composition id="OrcamentoTancredoNevesGuia" component={OrcamentoTancredoNeves} durationInFrames={QUADROS_PTN} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PTN, revisao: REVISAO_PTN}} />
    <Composition id="OrcamentoTancredoNevesLimpo" component={OrcamentoTancredoNeves} durationInFrames={QUADROS_PTN} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PTN, revisao: REVISAO_PTN}} />
    <Still id="CapaOrcamentoTancredoNeves" component={CapaOrcamentoTancredoNeves} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoJussari" component={OrcamentoJussari} durationInFrames={QUADROS_JUS} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_JUS, revisao: REVISAO_JUS}} />
    <Composition id="OrcamentoJussariGuia" component={OrcamentoJussari} durationInFrames={QUADROS_JUS} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_JUS, revisao: REVISAO_JUS}} />
    <Composition id="OrcamentoJussariLimpo" component={OrcamentoJussari} durationInFrames={QUADROS_JUS} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_JUS, revisao: REVISAO_JUS}} />
    <Still id="CapaOrcamentoJussari" component={CapaOrcamentoJussari} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSantaLuzia" component={OrcamentoSantaLuzia} durationInFrames={QUADROS_SLZ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SLZ, revisao: REVISAO_SLZ}} />
    <Composition id="OrcamentoSantaLuziaGuia" component={OrcamentoSantaLuzia} durationInFrames={QUADROS_SLZ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SLZ, revisao: REVISAO_SLZ}} />
    <Composition id="OrcamentoSantaLuziaLimpo" component={OrcamentoSantaLuzia} durationInFrames={QUADROS_SLZ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SLZ, revisao: REVISAO_SLZ}} />
    <Still id="CapaOrcamentoSantaLuzia" component={CapaOrcamentoSantaLuzia} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSaoJoseVitoria" component={OrcamentoSaoJoseVitoria} durationInFrames={QUADROS_SJV} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SJV, revisao: REVISAO_SJV}} />
    <Composition id="OrcamentoSaoJoseVitoriaGuia" component={OrcamentoSaoJoseVitoria} durationInFrames={QUADROS_SJV} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SJV, revisao: REVISAO_SJV}} />
    <Composition id="OrcamentoSaoJoseVitoriaLimpo" component={OrcamentoSaoJoseVitoria} durationInFrames={QUADROS_SJV} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SJV, revisao: REVISAO_SJV}} />
    <Still id="CapaOrcamentoSaoJoseVitoria" component={CapaOrcamentoSaoJoseVitoria} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoBotupora" component={OrcamentoBotupora} durationInFrames={QUADROS_BTP} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BTP, revisao: REVISAO_BTP}} />
    <Composition id="OrcamentoBotuporaGuia" component={OrcamentoBotupora} durationInFrames={QUADROS_BTP} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BTP, revisao: REVISAO_BTP}} />
    <Composition id="OrcamentoBotuporaLimpo" component={OrcamentoBotupora} durationInFrames={QUADROS_BTP} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BTP, revisao: REVISAO_BTP}} />
    <Still id="CapaOrcamentoBotupora" component={CapaOrcamentoBotupora} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoBarraEstiva" component={OrcamentoBarraEstiva} durationInFrames={QUADROS_BDE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BDE, revisao: REVISAO_BDE}} />
    <Composition id="OrcamentoBarraEstivaGuia" component={OrcamentoBarraEstiva} durationInFrames={QUADROS_BDE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BDE, revisao: REVISAO_BDE}} />
    <Composition id="OrcamentoBarraEstivaLimpo" component={OrcamentoBarraEstiva} durationInFrames={QUADROS_BDE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BDE, revisao: REVISAO_BDE}} />
    <Still id="CapaOrcamentoBarraEstiva" component={CapaOrcamentoBarraEstiva} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCacule" component={OrcamentoCacule} durationInFrames={QUADROS_CAC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CAC, revisao: REVISAO_CAC}} />
    <Composition id="OrcamentoCaculeGuia" component={OrcamentoCacule} durationInFrames={QUADROS_CAC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CAC, revisao: REVISAO_CAC}} />
    <Composition id="OrcamentoCaculeLimpo" component={OrcamentoCacule} durationInFrames={QUADROS_CAC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CAC, revisao: REVISAO_CAC}} />
    <Still id="CapaOrcamentoCacule" component={CapaOrcamentoCacule} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoTanhacu" component={OrcamentoTanhacu} durationInFrames={QUADROS_TNH} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_TNH, revisao: REVISAO_TNH}} />
    <Composition id="OrcamentoTanhacuGuia" component={OrcamentoTanhacu} durationInFrames={QUADROS_TNH} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_TNH, revisao: REVISAO_TNH}} />
    <Composition id="OrcamentoTanhacuLimpo" component={OrcamentoTanhacu} durationInFrames={QUADROS_TNH} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_TNH, revisao: REVISAO_TNH}} />
    <Still id="CapaOrcamentoTanhacu" component={CapaOrcamentoTanhacu} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoPiata" component={OrcamentoPiata} durationInFrames={QUADROS_PIA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PIA, revisao: REVISAO_PIA}} />
    <Composition id="OrcamentoPiataGuia" component={OrcamentoPiata} durationInFrames={QUADROS_PIA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PIA, revisao: REVISAO_PIA}} />
    <Composition id="OrcamentoPiataLimpo" component={OrcamentoPiata} durationInFrames={QUADROS_PIA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PIA, revisao: REVISAO_PIA}} />
    <Still id="CapaOrcamentoPiata" component={CapaOrcamentoPiata} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoArataca" component={OrcamentoArataca} durationInFrames={QUADROS_ARA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ARA, revisao: REVISAO_ARA}} />
    <Composition id="OrcamentoAratacaGuia" component={OrcamentoArataca} durationInFrames={QUADROS_ARA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ARA, revisao: REVISAO_ARA}} />
    <Composition id="OrcamentoAratacaLimpo" component={OrcamentoArataca} durationInFrames={QUADROS_ARA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ARA, revisao: REVISAO_ARA}} />
    <Still id="CapaOrcamentoArataca" component={CapaOrcamentoArataca} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoMarau" component={OrcamentoMarau} durationInFrames={QUADROS_MAR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MAR, revisao: REVISAO_MAR}} />
    <Composition id="OrcamentoMarauGuia" component={OrcamentoMarau} durationInFrames={QUADROS_MAR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MAR, revisao: REVISAO_MAR}} />
    <Composition id="OrcamentoMarauLimpo" component={OrcamentoMarau} durationInFrames={QUADROS_MAR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MAR, revisao: REVISAO_MAR}} />
    <Still id="CapaOrcamentoMarau" component={CapaOrcamentoMarau} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoDiasDavila" component={OrcamentoDiasDavila} durationInFrames={QUADROS_DDA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_DDA, revisao: REVISAO_DDA}} />
    <Composition id="OrcamentoDiasDavilaGuia" component={OrcamentoDiasDavila} durationInFrames={QUADROS_DDA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_DDA, revisao: REVISAO_DDA}} />
    <Composition id="OrcamentoDiasDavilaLimpo" component={OrcamentoDiasDavila} durationInFrames={QUADROS_DDA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_DDA, revisao: REVISAO_DDA}} />
    <Still id="CapaOrcamentoDiasDavila" component={CapaOrcamentoDiasDavila} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCatu" component={OrcamentoCatu} durationInFrames={QUADROS_CATU} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CATU, revisao: REVISAO_CATU}} />
    <Composition id="OrcamentoCatuGuia" component={OrcamentoCatu} durationInFrames={QUADROS_CATU} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CATU, revisao: REVISAO_CATU}} />
    <Composition id="OrcamentoCatuLimpo" component={OrcamentoCatu} durationInFrames={QUADROS_CATU} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CATU, revisao: REVISAO_CATU}} />
    <Still id="CapaOrcamentoCatu" component={CapaOrcamentoCatu} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItape" component={OrcamentoItape} durationInFrames={QUADROS_ITAPE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITAPE, revisao: REVISAO_ITAPE}} />
    <Composition id="OrcamentoItapeGuia" component={OrcamentoItape} durationInFrames={QUADROS_ITAPE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITAPE, revisao: REVISAO_ITAPE}} />
    <Composition id="OrcamentoItapeLimpo" component={OrcamentoItape} durationInFrames={QUADROS_ITAPE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITAPE, revisao: REVISAO_ITAPE}} />
    <Still id="CapaOrcamentoItape" component={CapaOrcamentoItape} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoPojuca" component={OrcamentoPojuca} durationInFrames={QUADROS_POJUCA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_POJUCA, revisao: REVISAO_POJUCA}} />
    <Composition id="OrcamentoPojucaGuia" component={OrcamentoPojuca} durationInFrames={QUADROS_POJUCA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_POJUCA, revisao: REVISAO_POJUCA}} />
    <Composition id="OrcamentoPojucaLimpo" component={OrcamentoPojuca} durationInFrames={QUADROS_POJUCA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_POJUCA, revisao: REVISAO_POJUCA}} />
    <Still id="CapaOrcamentoPojuca" component={CapaOrcamentoPojuca} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoIbotirama" component={OrcamentoIbotirama} durationInFrames={QUADROS_IBO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_IBO, revisao: REVISAO_IBO}} />
    <Composition id="OrcamentoIbotiramaGuia" component={OrcamentoIbotirama} durationInFrames={QUADROS_IBO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_IBO, revisao: REVISAO_IBO}} />
    <Composition id="OrcamentoIbotiramaLimpo" component={OrcamentoIbotirama} durationInFrames={QUADROS_IBO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_IBO, revisao: REVISAO_IBO}} />
    <Still id="CapaOrcamentoIbotirama" component={CapaOrcamentoIbotirama} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoXiqueXique" component={OrcamentoXiqueXique} durationInFrames={QUADROS_XIQUEXIQUE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_XIQUEXIQUE, revisao: REVISAO_XIQUEXIQUE}} />
    <Composition id="OrcamentoXiqueXiqueGuia" component={OrcamentoXiqueXique} durationInFrames={QUADROS_XIQUEXIQUE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_XIQUEXIQUE, revisao: REVISAO_XIQUEXIQUE}} />
    <Composition id="OrcamentoXiqueXiqueLimpo" component={OrcamentoXiqueXique} durationInFrames={QUADROS_XIQUEXIQUE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_XIQUEXIQUE, revisao: REVISAO_XIQUEXIQUE}} />
    <Still id="CapaOrcamentoXiqueXique" component={CapaOrcamentoXiqueXique} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoPauloAfonso" component={OrcamentoPauloAfonso} durationInFrames={QUADROS_PAULOAFONSO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PAULOAFONSO, revisao: REVISAO_PAULOAFONSO}} />
    <Composition id="OrcamentoPauloAfonsoGuia" component={OrcamentoPauloAfonso} durationInFrames={QUADROS_PAULOAFONSO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PAULOAFONSO, revisao: REVISAO_PAULOAFONSO}} />
    <Composition id="OrcamentoPauloAfonsoLimpo" component={OrcamentoPauloAfonso} durationInFrames={QUADROS_PAULOAFONSO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PAULOAFONSO, revisao: REVISAO_PAULOAFONSO}} />
    <Still id="CapaOrcamentoPauloAfonso" component={CapaOrcamentoPauloAfonso} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCarinhanha" component={OrcamentoCarinhanha} durationInFrames={QUADROS_CARINHANHA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CARINHANHA, revisao: REVISAO_CARINHANHA}} />
    <Composition id="OrcamentoCarinhanhaGuia" component={OrcamentoCarinhanha} durationInFrames={QUADROS_CARINHANHA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CARINHANHA, revisao: REVISAO_CARINHANHA}} />
    <Composition id="OrcamentoCarinhanhaLimpo" component={OrcamentoCarinhanha} durationInFrames={QUADROS_CARINHANHA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CARINHANHA, revisao: REVISAO_CARINHANHA}} />
    <Still id="CapaOrcamentoCarinhanha" component={CapaOrcamentoCarinhanha} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSaoDesiderio" component={OrcamentoSaoDesiderio} durationInFrames={QUADROS_SAODESIDERIO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SAODESIDERIO, revisao: REVISAO_SAODESIDERIO}} />
    <Composition id="OrcamentoSaoDesiderioGuia" component={OrcamentoSaoDesiderio} durationInFrames={QUADROS_SAODESIDERIO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SAODESIDERIO, revisao: REVISAO_SAODESIDERIO}} />
    <Composition id="OrcamentoSaoDesiderioLimpo" component={OrcamentoSaoDesiderio} durationInFrames={QUADROS_SAODESIDERIO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SAODESIDERIO, revisao: REVISAO_SAODESIDERIO}} />
    <Still id="CapaOrcamentoSaoDesiderio" component={CapaOrcamentoSaoDesiderio} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoRuyBarbosa" component={OrcamentoRuyBarbosa} durationInFrames={QUADROS_RUYBARBOSA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RUYBARBOSA, revisao: REVISAO_RUYBARBOSA}} />
    <Composition id="OrcamentoRuyBarbosaGuia" component={OrcamentoRuyBarbosa} durationInFrames={QUADROS_RUYBARBOSA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RUYBARBOSA, revisao: REVISAO_RUYBARBOSA}} />
    <Composition id="OrcamentoRuyBarbosaLimpo" component={OrcamentoRuyBarbosa} durationInFrames={QUADROS_RUYBARBOSA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RUYBARBOSA, revisao: REVISAO_RUYBARBOSA}} />
    <Still id="CapaOrcamentoRuyBarbosa" component={CapaOrcamentoRuyBarbosa} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoRiachaoDoJacuipe" component={OrcamentoRiachaoDoJacuipe} durationInFrames={QUADROS_RIACHAODOJACUIPE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RIACHAODOJACUIPE, revisao: REVISAO_RIACHAODOJACUIPE}} />
    <Composition id="OrcamentoRiachaoDoJacuipeGuia" component={OrcamentoRiachaoDoJacuipe} durationInFrames={QUADROS_RIACHAODOJACUIPE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RIACHAODOJACUIPE, revisao: REVISAO_RIACHAODOJACUIPE}} />
    <Composition id="OrcamentoRiachaoDoJacuipeLimpo" component={OrcamentoRiachaoDoJacuipe} durationInFrames={QUADROS_RIACHAODOJACUIPE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RIACHAODOJACUIPE, revisao: REVISAO_RIACHAODOJACUIPE}} />
    <Still id="CapaOrcamentoRiachaoDoJacuipe" component={CapaOrcamentoRiachaoDoJacuipe} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSerraDoRamalho" component={OrcamentoSerraDoRamalho} durationInFrames={QUADROS_SERRARAMALHO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SERRARAMALHO, revisao: REVISAO_SERRARAMALHO}} />
    <Composition id="OrcamentoSerraDoRamalhoGuia" component={OrcamentoSerraDoRamalho} durationInFrames={QUADROS_SERRARAMALHO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SERRARAMALHO, revisao: REVISAO_SERRARAMALHO}} />
    <Composition id="OrcamentoSerraDoRamalhoLimpo" component={OrcamentoSerraDoRamalho} durationInFrames={QUADROS_SERRARAMALHO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SERRARAMALHO, revisao: REVISAO_SERRARAMALHO}} />
    <Still id="CapaOrcamentoSerraDoRamalho" component={CapaOrcamentoSerraDoRamalho} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoItaberaba" component={OrcamentoItaberaba} durationInFrames={QUADROS_ITABERABA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITABERABA, revisao: REVISAO_ITABERABA}} />
    <Composition id="OrcamentoItaberabaGuia" component={OrcamentoItaberaba} durationInFrames={QUADROS_ITABERABA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITABERABA, revisao: REVISAO_ITABERABA}} />
    <Composition id="OrcamentoItaberabaLimpo" component={OrcamentoItaberaba} durationInFrames={QUADROS_ITABERABA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITABERABA, revisao: REVISAO_ITABERABA}} />
    <Still id="CapaOrcamentoItaberaba" component={CapaOrcamentoItaberaba} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoJaguarari" component={OrcamentoJaguarari} durationInFrames={QUADROS_JAGUARARI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_JAGUARARI, revisao: REVISAO_JAGUARARI}} />
    <Composition id="OrcamentoJaguarariGuia" component={OrcamentoJaguarari} durationInFrames={QUADROS_JAGUARARI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_JAGUARARI, revisao: REVISAO_JAGUARARI}} />
    <Composition id="OrcamentoJaguarariLimpo" component={OrcamentoJaguarari} durationInFrames={QUADROS_JAGUARARI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_JAGUARARI, revisao: REVISAO_JAGUARARI}} />
    <Still id="CapaOrcamentoJaguarari" component={CapaOrcamentoJaguarari} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSenhorDoBonfim" component={OrcamentoSenhorDoBonfim} durationInFrames={QUADROS_SDB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SDB, revisao: REVISAO_SDB}} />
    <Composition id="OrcamentoSenhorDoBonfimGuia" component={OrcamentoSenhorDoBonfim} durationInFrames={QUADROS_SDB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SDB, revisao: REVISAO_SDB}} />
    <Composition id="OrcamentoSenhorDoBonfimLimpo" component={OrcamentoSenhorDoBonfim} durationInFrames={QUADROS_SDB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SDB, revisao: REVISAO_SDB}} />
    <Still id="CapaOrcamentoSenhorDoBonfim" component={CapaOrcamentoSenhorDoBonfim} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoEntreRios" component={OrcamentoEntreRios} durationInFrames={QUADROS_ER} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ER, revisao: REVISAO_ER}} />
    <Composition id="OrcamentoEntreRiosGuia" component={OrcamentoEntreRios} durationInFrames={QUADROS_ER} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ER, revisao: REVISAO_ER}} />
    <Composition id="OrcamentoEntreRiosLimpo" component={OrcamentoEntreRios} durationInFrames={QUADROS_ER} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ER, revisao: REVISAO_ER}} />
    <Still id="CapaOrcamentoEntreRios" component={CapaOrcamentoEntreRios} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoRiachaoDasNeves" component={OrcamentoRiachaoDasNeves} durationInFrames={QUADROS_RIACHAONEVES} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RIACHAONEVES, revisao: REVISAO_RIACHAONEVES}} />
    <Composition id="OrcamentoRiachaoDasNevesGuia" component={OrcamentoRiachaoDasNeves} durationInFrames={QUADROS_RIACHAONEVES} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RIACHAONEVES, revisao: REVISAO_RIACHAONEVES}} />
    <Composition id="OrcamentoRiachaoDasNevesLimpo" component={OrcamentoRiachaoDasNeves} durationInFrames={QUADROS_RIACHAONEVES} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RIACHAONEVES, revisao: REVISAO_RIACHAONEVES}} />
    <Still id="CapaOrcamentoRiachaoDasNeves" component={CapaOrcamentoRiachaoDasNeves} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoMorroDoChapeu" component={OrcamentoMorroDoChapeu} durationInFrames={QUADROS_MORROCHAPEU} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MORROCHAPEU, revisao: REVISAO_MORROCHAPEU}} />
    <Composition id="OrcamentoMorroDoChapeuGuia" component={OrcamentoMorroDoChapeu} durationInFrames={QUADROS_MORROCHAPEU} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MORROCHAPEU, revisao: REVISAO_MORROCHAPEU}} />
    <Composition id="OrcamentoMorroDoChapeuLimpo" component={OrcamentoMorroDoChapeu} durationInFrames={QUADROS_MORROCHAPEU} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MORROCHAPEU, revisao: REVISAO_MORROCHAPEU}} />
    <Still id="CapaOrcamentoMorroDoChapeu" component={CapaOrcamentoMorroDoChapeu} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoIpira" component={OrcamentoIpira} durationInFrames={QUADROS_IPIRA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_IPIRA, revisao: REVISAO_IPIRA}} />
    <Composition id="OrcamentoIpiraGuia" component={OrcamentoIpira} durationInFrames={QUADROS_IPIRA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_IPIRA, revisao: REVISAO_IPIRA}} />
    <Composition id="OrcamentoIpiraLimpo" component={OrcamentoIpira} durationInFrames={QUADROS_IPIRA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_IPIRA, revisao: REVISAO_IPIRA}} />
    <Still id="CapaOrcamentoIpira" component={CapaOrcamentoIpira} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoCastroAlves" component={OrcamentoCastroAlves} durationInFrames={QUADROS_CAV} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CAV, revisao: REVISAO_CAV}} />
    <Composition id="OrcamentoCastroAlvesGuia" component={OrcamentoCastroAlves} durationInFrames={QUADROS_CAV} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CAV, revisao: REVISAO_CAV}} />
    <Composition id="OrcamentoCastroAlvesLimpo" component={OrcamentoCastroAlves} durationInFrames={QUADROS_CAV} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CAV, revisao: REVISAO_CAV}} />
    <Still id="CapaOrcamentoCastroAlves" component={CapaOrcamentoCastroAlves} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSaoFranciscoDoConde" component={OrcamentoSaoFranciscoDoConde} durationInFrames={QUADROS_SFC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SFC, revisao: REVISAO_SFC}} />
    <Composition id="OrcamentoSaoFranciscoDoCondeGuia" component={OrcamentoSaoFranciscoDoConde} durationInFrames={QUADROS_SFC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SFC, revisao: REVISAO_SFC}} />
    <Composition id="OrcamentoSaoFranciscoDoCondeLimpo" component={OrcamentoSaoFranciscoDoConde} durationInFrames={QUADROS_SFC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SFC, revisao: REVISAO_SFC}} />
    <Still id="CapaOrcamentoSaoFranciscoDoConde" component={CapaOrcamentoSaoFranciscoDoConde} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoInhambupeTcm" component={OrcamentoInhambupeTcm} durationInFrames={QUADROS_INT} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_INT, revisao: REVISAO_INT}} />
    <Composition id="OrcamentoInhambupeTcmGuia" component={OrcamentoInhambupeTcm} durationInFrames={QUADROS_INT} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_INT, revisao: REVISAO_INT}} />
    <Composition id="OrcamentoInhambupeTcmLimpo" component={OrcamentoInhambupeTcm} durationInFrames={QUADROS_INT} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_INT, revisao: REVISAO_INT}} />
    <Still id="CapaOrcamentoInhambupeTcm" component={CapaOrcamentoInhambupeTcm} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSantoAmaro" component={OrcamentoSantoAmaro} durationInFrames={QUADROS_SAM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SAM, revisao: REVISAO_SAM}} />
    <Composition id="OrcamentoSantoAmaroGuia" component={OrcamentoSantoAmaro} durationInFrames={QUADROS_SAM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SAM, revisao: REVISAO_SAM}} />
    <Composition id="OrcamentoSantoAmaroLimpo" component={OrcamentoSantoAmaro} durationInFrames={QUADROS_SAM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SAM, revisao: REVISAO_SAM}} />
    <Still id="CapaOrcamentoSantoAmaro" component={CapaOrcamentoSantoAmaro} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoSantoAntonio" component={OrcamentoSantoAntonio} durationInFrames={QUADROS_SAJ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SAJ, revisao: REVISAO_SAJ}} />
    <Composition id="OrcamentoSantoAntonioGuia" component={OrcamentoSantoAntonio} durationInFrames={QUADROS_SAJ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SAJ, revisao: REVISAO_SAJ}} />
    <Composition id="OrcamentoSantoAntonioLimpo" component={OrcamentoSantoAntonio} durationInFrames={QUADROS_SAJ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SAJ, revisao: REVISAO_SAJ}} />
    <Still id="CapaOrcamentoSantoAntonio" component={CapaOrcamentoSantoAntonio} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="OrcamentoMaracas" component={OrcamentoMaracas} durationInFrames={QUADROS_MRC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MRC, revisao: REVISAO_MRC}} />
    <Composition id="OrcamentoMaracasGuia" component={OrcamentoMaracas} durationInFrames={QUADROS_MRC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MRC, revisao: REVISAO_MRC}} />
    <Composition id="OrcamentoMaracasLimpo" component={OrcamentoMaracas} durationInFrames={QUADROS_MRC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MRC, revisao: REVISAO_MRC}} />
    <Still id="CapaOrcamentoMaracas" component={CapaOrcamentoMaracas} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
    <Composition id="EducacaoIlheus" component={EducacaoIlheus} durationInFrames={QUADROS_EI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_EI, revisao: REVISAO_EI}} />
    <Composition id="EducacaoIlheusGuia" component={EducacaoIlheus} durationInFrames={QUADROS_EI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_EI, revisao: REVISAO_EI}} />
    <Composition id="EducacaoIlheusLimpo" component={EducacaoIlheus} durationInFrames={QUADROS_EI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_EI, revisao: REVISAO_EI}} />
    <Still id="CapaEducacaoIlheus" component={CapaEducacaoIlheus} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
