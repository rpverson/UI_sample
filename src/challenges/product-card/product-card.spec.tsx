import { describe, expect, it } from 'vitest';
import { challenges } from '../registry';
import type { BuilderNode } from '../../builder/types';

describe('product-card', () => {
  const challenge = challenges.find((item) => item.id === 'product-card');

  it('pasa cuando existe contenedor, imagen, precio y boton', () => {
    const tree: BuilderNode[] = [
      {
        id: 'root',
        tag: 'article',
        content: '',
        classes: ['rounded-xl', 'border', 'shadow-sm'],
        children: [
          { id: 'img', tag: 'img', content: 'Producto', classes: [], children: [] },
          { id: 'title', tag: 'h3', content: 'Reloj', classes: [], children: [] },
          { id: 'price', tag: 'p', content: '$49.00', classes: [], children: [] },
          { id: 'btn', tag: 'button', content: 'Anadir', classes: ['bg-slate-900'], children: [] }
        ]
      }
    ];
    const checks = challenge!.validate(tree);
    expect(checks.every((item) => item.passed)).toBe(true);
  });

  it('marca fallos cuando faltan criterios', () => {
    const tree: BuilderNode[] = [
      { id: 'root', tag: 'div', content: 'Sin estructura', classes: [], children: [] }
    ];
    const checks = challenge!.validate(tree);
    expect(checks.some((item) => !item.passed)).toBe(true);
  });
});
