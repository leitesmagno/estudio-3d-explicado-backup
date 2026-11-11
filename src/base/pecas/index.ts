// Estúdio 3D Explicado · base/pecas
// Tudo que é 3D vem daqui: import {Caixa, Boneco, Palco, ...} from '../../base/pecas';
export type {V3, Cam, Foco, Pose, Linha} from './tipos';
export {useDescartar, geoCaixa, useGeoCaixa} from './geometria';
export {Fosco, Caixa} from './caixa';
export {Camera, projetar, cinematizar, enquadrar, misturarCam, trilhoCam, focoAuto, focarEm, distancia, type OpcoesCinema} from './camera';
export {Palco, AcabamentoCinema, usarTemaAtivo} from './palco';
export {Particulas, Onda, Vapor} from './efeitos';
export {Boneco, MEDIDAS_BONECO} from './boneco';
export {Placa} from './placa';
export {Celular, Predio, Moeda, Pilhas, Cofre} from './objetos';
export {mistura} from '../cores';
