// Estúdio 3D Explicado · tipos comuns das peças

/** Vetor 3D [x, y, z]. y é para cima. A "frente" das peças é z+. */
export type V3 = [number, number, number];

/**
 * Câmera como dado (não é objeto do three).
 * - pos: onde a câmera está. alvo: para onde olha. fov: abertura vertical em graus.
 * - sobe: quantos PIXELS o alvo aparece ACIMA do centro do quadro (deixa espaço para a legenda). Padrão 0.
 * - rolo: inclinação da câmera em radianos (opcional, use pouco).
 */
export type Cam = {pos: V3; alvo: V3; fov: number; sobe?: number; rolo?: number};

/**
 * Foco do desfoque de lente (profundidade de campo).
 * - dist: distância da câmera até o que fica nítido (unidades do mundo).
 * - faixa: tamanho da região nítida em volta de dist.
 * - bokeh: força do desfoque fora da faixa (0 desliga; 3 a 6 é cinema).
 */
export type Foco = {dist: number; faixa: number; bokeh: number};

/**
 * Pose do Boneco. Ângulos em radianos, tudo opcional.
 * - ombroD / ombroE: rotação [x, y, z] do braço direito / esquerdo a partir do ombro.
 *   x negativo leva o braço para a FRENTE; z positivo abre o braço D para fora (no E, z negativo abre).
 * - cotoveloD / cotoveloE: dobra do antebraço (negativo dobra para a frente).
 * - cabeca: rotação [x, y, z] da cabeça (x positivo olha para baixo).
 * - tronco: inclinação do tronco para a frente (positivo).
 * - passo: fase da caminhada, de -1 a 1 (use Math.sin(t * 6) * andando). Mexe pernas e, se você não der ombro, braços.
 */
export type Pose = {
  ombroD?: V3;
  ombroE?: V3;
  cotoveloD?: number;
  cotoveloE?: number;
  cabeca?: V3;
  tronco?: number;
  passo?: number;
};

/**
 * Uma linha de texto da Placa.
 * - t: texto. tam: tamanho da letra em px numa textura de 1024 px de largura (a placa inteira).
 * - cor: cor do texto. peso: 100 a 900 (padrão 800). mono: usa a fonte mono.
 */
export type Linha = {t: string; tam: number; cor: string; peso?: number; mono?: boolean};
