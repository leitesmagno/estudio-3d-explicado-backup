// MODELO DE ESTILO. Copie este arquivo como src/estilos/<id>.ts (id: minúsculas e números, ex. "direitotrabalhador"),
// troque os valores e registre o estilo em src/estilo.ts. Este modelo NÃO está registrado.
//
// Regras:
// - Herde de ESCURO (fundo escuro) ou CLARO (fundo creme) e troque só o que precisar.
// - Um único acento (acento). Ele vai só no que importa em cada cena.
// - Cores sempre em hexadecimal "#RRGGBB" (exceto legendaFundo, que pode ser rgba()).
// - Teste com a composição AmostraEstilo antes de usar num vídeo.

import {ESCURO, type Tema} from '../base/tema';

// Perfil: @seuperfil · Nicho: (o assunto do perfil)
export const SERIE = 'Nome da Série';

export const MODELO: Tema = {
  ...ESCURO,
  nome: 'modelo',
  serie: SERIE,
  chamada: 'E segue o Nome da Série para entender mais.',
  acento: '#2F7DD1', // a cor do destaque
  // Opcionais (descomente para trocar):
  // fundo: '#16151A',
  // objetoClaro: '#F0EBE1',
  // texto: '#F0EBE1',
  // fonte: "'Inter', sans-serif",
};
