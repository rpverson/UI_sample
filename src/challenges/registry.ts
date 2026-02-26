import type { Challenge } from './types';
import { walkTree } from '../builder/core';
import type { BuilderNode } from '../builder/types';

function hasClass(node: BuilderNode, klass: string): boolean {
  return node.classes.includes(klass);
}

function hasClassMatching(node: BuilderNode, pattern: RegExp): boolean {
  return node.classes.some((klass) => pattern.test(klass));
}

export const challenges: Challenge[] = [
  {
    id: 'button-primary',
    title: 'Botón primario',
    description:
      'Construye un botón principal sin escribir código manual.\n\nCriterios:\n- Debe existir un <button> con texto "Continuar".\n- Debe usar clases de botón primario.\n- Debe incluir estado de hover y/o focus-visible.',
    starterTree: [
      {
        id: 'button-primary-root',
        tag: 'button',
        content: 'Continuar',
        classes: [],
        children: []
      }
    ],
    validate: (tree) => {
      const nodes = walkTree(tree);
      const button = nodes.find((node) => node.tag === 'button');
      return [
        {
          id: 'btn-exists',
          label: 'Existe un elemento <button>',
          passed: Boolean(button)
        },
        {
          id: 'btn-text',
          label: 'El botón contiene el texto "Continuar"',
          passed: (button?.content ?? '').trim().toLowerCase() === 'continuar'
        },
        {
          id: 'btn-primary-class',
          label: 'Incluye clases primarias (bg + text-white + rounded)',
          passed: Boolean(
            button &&
              hasClassMatching(button, /^bg-/) &&
              hasClass(button, 'text-white') &&
              hasClassMatching(button, /^rounded/)
          )
        },
        {
          id: 'btn-state',
          label: 'Incluye clase de estado hover o focus-visible',
          passed: Boolean(button && hasClassMatching(button, /^(hover:|focus-visible:)/))
        }
      ];
    }
  },
  {
    id: 'product-card',
    title: 'Card de producto',
    description:
      'Construye una card con imagen, nombre, precio y botón.\n\nCriterios:\n- Contenedor con borde, radio y sombra.\n- Imagen con texto alternativo.\n- Precio visible (por ejemplo "$49.00").\n- Botón de acción.',
    starterTree: [
      {
        id: 'card-root',
        tag: 'article',
        content: '',
        classes: [],
        children: []
      }
    ],
    validate: (tree) => {
      const nodes = walkTree(tree);
      const image = nodes.find((node) => node.tag === 'img');
      const button = nodes.find((node) => node.tag === 'button');
      const container = nodes.find(
        (node) =>
          hasClassMatching(node, /^rounded/) &&
          hasClass(node, 'border') &&
          hasClassMatching(node, /^shadow/)
      );
      const hasPrice = nodes.some((node) => /\$\s*\d/.test(node.content));

      return [
        {
          id: 'card-container',
          label: 'Hay contenedor con borde + rounded + shadow',
          passed: Boolean(container)
        },
        {
          id: 'card-image',
          label: 'Hay una imagen con alt (contenido de img)',
          passed: Boolean(image && image.content.trim().length > 0)
        },
        {
          id: 'card-price',
          label: 'Existe un texto que parece precio',
          passed: hasPrice
        },
        {
          id: 'card-button',
          label: 'Existe un botón de acción',
          passed: Boolean(button)
        }
      ];
    }
  }
  // <challenge-add-marker>
];
