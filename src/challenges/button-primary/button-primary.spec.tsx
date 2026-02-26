import { describe, expect, it } from 'vitest';
import { challenges } from '../registry';
import type { BuilderNode } from '../../builder/types';

describe('button-primary', () => {
  const challenge = challenges.find((item) => item.id === 'button-primary');

  it('pasa cuando el arbol cumple los criterios', () => {
    const tree: BuilderNode[] = [
      {
        id: '1',
        tag: 'button',
        content: 'Continuar',
        classes: ['bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700'],
        children: []
      }
    ];
    const checks = challenge!.validate(tree);
    expect(checks.every((item) => item.passed)).toBe(true);
  });

  it('falla checks clave cuando falta estilo/estado', () => {
    const tree: BuilderNode[] = [
      {
        id: '1',
        tag: 'button',
        content: 'Continuar',
        classes: [],
        children: []
      }
    ];
    const checks = challenge!.validate(tree);
    expect(checks.some((item) => !item.passed)).toBe(true);
  });
});
