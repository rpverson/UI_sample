import { describe, expect, it } from 'vitest';
import { addChildNode, createNode, removeNode, serializeHtml } from './core';
import type { BuilderNode } from './types';

describe('builder core', () => {
  it('agrega un hijo al nodo padre indicado', () => {
    const root: BuilderNode = {
      id: 'root',
      tag: 'div',
      content: '',
      classes: [],
      children: []
    };
    const child = createNode('p', 'Hola');
    const next = addChildNode([root], 'root', child);

    expect(next[0].children).toHaveLength(1);
    expect(next[0].children[0].content).toBe('Hola');
  });

  it('elimina nodos de forma recursiva', () => {
    const tree: BuilderNode[] = [
      {
        id: 'root',
        tag: 'div',
        content: '',
        classes: [],
        children: [{ id: 'child', tag: 'span', content: 'x', classes: [], children: [] }]
      }
    ];
    const next = removeNode(tree, 'child');
    expect(next[0].children).toHaveLength(0);
  });

  it('serializa html incluyendo attrs relevantes', () => {
    const html = serializeHtml([
      {
        id: 'a',
        tag: 'button',
        content: 'Continuar',
        classes: ['bg-blue-600', 'text-white'],
        children: []
      }
    ]);
    expect(html).toContain('<button');
    expect(html).toContain('class="bg-blue-600 text-white"');
    expect(html).toContain('Continuar');
  });
});

