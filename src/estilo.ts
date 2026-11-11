// Estilo ativo do Estúdio. Para um perfil novo:
//  1. crie src/estilos/<id>.ts (copie src/estilos/modelo.ts);
//  2. importe e registre aqui embaixo com registrarEstilo('<id>', ...);
//  3. troque ATIVO para '<id>'.
// Todo vídeo usa MEU_ESTILO e SERIE daqui, e aceita a prop `estilo` para testar outro estilo registrado.

import {ESTILOS, registrarEstilo, type Tema} from './base/tema';
import {EXPLICANDO, SERIE as SERIE_EXPLICANDO} from './estilos/explicando';
import {EUMAGNOLEITE} from './estilos/eumagnoleite';

registrarEstilo('explicando', EXPLICANDO);
registrarEstilo('eumagnoleite', EUMAGNOLEITE);
// registrarEstilo('outroperfil', OUTRO);

/** Id do estilo usado por padrão em todos os vídeos. */
export const ATIVO = 'eumagnoleite';

/** Tema do estilo ativo. */
export const MEU_ESTILO: Tema = ESTILOS[ATIVO];

/** Nome da série do estilo ativo. */
export const SERIE: string = MEU_ESTILO.serie ?? SERIE_EXPLICANDO;

/** Tema por id (cai no ativo se o id não existir). */
export const temaPorId = (id?: string): Tema => (id && ESTILOS[id]) || MEU_ESTILO;
