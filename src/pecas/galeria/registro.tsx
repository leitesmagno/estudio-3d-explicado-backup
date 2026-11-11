// Registro da galeria de peças no Root: uma pasta "GaleriaPecas" com um still por página.
// Uso em src/Root.tsx:  import {GaleriaPecas} from './pecas/galeria/registro';  e  <GaleriaPecas />
// Render de uma página: npx remotion still PecasPessoas1 "projetos/_estudio/galeria/pessoas e bonecos 1.jpg"
// Todas de uma vez: node scripts/galeria.mjs  (só algumas: node scripts/galeria.mjs Pessoas Casa)
import React from 'react';
import {Folder, Still} from 'remotion';
import {ALTURA, LARGURA} from '../../base/reels';
import {ATIVO} from '../../estilo';
import {PAGINAS, PaginaGaleria} from './Galeria';

export const GaleriaPecas: React.FC = () => (
  <Folder name="GaleriaPecas">
    {PAGINAS.map((p) => (
      <Still key={p.id} id={p.id} component={PaginaGaleria} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO, pagina: p.id, arquivo: p.arquivo}} />
    ))}
  </Folder>
);
