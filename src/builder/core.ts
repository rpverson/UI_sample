import type { BuilderNode, BuilderTag, TailwindClassGroup } from './types';

export const htmlTags: BuilderTag[] = [
  'div',
  'p',
  'span',
  'h1',
  'h2',
  'h3',
  'a',
  'button',
  'img',
  'input',
  'textarea',
  'ul',
  'li',
  'section',
  'header',
  'footer',
  'nav',
  'article'
];

export const tailwindClassesGrouped: TailwindClassGroup[] = [
  {
    category: 'Tipografia',
    classes: [
      'text-sm',
      'text-base',
      'text-lg',
      'text-xl',
      'font-medium',
      'font-semibold',
      'font-bold',
      'text-slate-900',
      'text-slate-700',
      'text-white',
      'text-center'
    ]
  },
  {
    category: 'Fondos',
    classes: ['bg-white', 'bg-slate-50', 'bg-slate-900', 'bg-blue-600', 'bg-blue-700']
  },
  {
    category: 'Espaciado',
    classes: ['p-2', 'p-3', 'p-4', 'p-6', 'px-3', 'px-4', 'py-2', 'py-3', 'mt-2', 'gap-2', 'gap-4']
  },
  {
    category: 'Layout',
    classes: [
      'flex',
      'flex-col',
      'items-center',
      'justify-between',
      'w-full',
      'max-w-sm',
      'mx-auto'
    ]
  },
  {
    category: 'Bordes y sombra',
    classes: ['rounded', 'rounded-lg', 'rounded-xl', 'border', 'border-slate-200', 'shadow-sm', 'shadow-md']
  },
  {
    category: 'Estados',
    classes: ['hover:bg-blue-700', 'focus-visible:ring-4', 'focus-visible:ring-blue-200']
  }
];

export const predefinedExamples: Array<{ name: string; tree: BuilderNode[] }> = [
  {
    name: 'Tarjeta basica',
    tree: [
      {
        id: 'card-1',
        tag: 'article',
        content: '',
        classes: ['max-w-sm', 'rounded-xl', 'border', 'border-slate-200', 'bg-white', 'p-4', 'shadow-sm'],
        children: [
          {
            id: 'card-title-1',
            tag: 'h3',
            content: 'Titulo de la tarjeta',
            classes: ['text-base', 'font-semibold', 'text-slate-900'],
            children: []
          },
          {
            id: 'card-text-1',
            tag: 'p',
            content: 'Descripcion breve',
            classes: ['mt-2', 'text-sm', 'text-slate-700'],
            children: []
          },
          {
            id: 'card-button-1',
            tag: 'button',
            content: 'Accion',
            classes: ['mt-2', 'rounded-lg', 'bg-blue-600', 'px-3', 'py-2', 'text-white', 'hover:bg-blue-700'],
            children: []
          }
        ]
      }
    ]
  },
  {
    name: 'Boton primario',
    tree: [
      {
        id: 'btn-1',
        tag: 'button',
        content: 'Continuar',
        classes: ['rounded-lg', 'bg-blue-600', 'px-4', 'py-2', 'text-white', 'hover:bg-blue-700'],
        children: []
      }
    ]
  }
];

export function createNode(tag: BuilderTag = 'div', content = 'Nuevo elemento'): BuilderNode {
  return {
    id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tag,
    content,
    classes: [],
    children: []
  };
}

export function findNodeById(tree: BuilderNode[], id: string | null): BuilderNode | null {
  if (!id) return null;
  for (const node of tree) {
    if (node.id === id) return node;
    const nested = findNodeById(node.children, id);
    if (nested) return nested;
  }
  return null;
}

export function updateNode(tree: BuilderNode[], id: string, updater: (node: BuilderNode) => BuilderNode): BuilderNode[] {
  return tree.map((node) => {
    if (node.id === id) return updater(node);
    if (node.children.length === 0) return node;
    return { ...node, children: updateNode(node.children, id, updater) };
  });
}

export function addChildNode(tree: BuilderNode[], parentId: string, child: BuilderNode): BuilderNode[] {
  return updateNode(tree, parentId, (node) => ({ ...node, children: [...node.children, child] }));
}

export function removeNode(tree: BuilderNode[], id: string): BuilderNode[] {
  return tree
    .filter((node) => node.id !== id)
    .map((node) => ({ ...node, children: removeNode(node.children, id) }));
}

export function serializeHtml(tree: BuilderNode[]): string {
  return tree.map(renderNode).join('\n');
}

function renderNode(node: BuilderNode): string {
  const classes = node.classes.join(' ');
  const attrs = classes.length > 0 ? ` class="${escapeHtml(classes)}"` : '';
  const childrenHtml = node.children.map(renderNode).join('');
  const content = escapeHtml(node.content);

  if (node.tag === 'img') {
    const alt = content || 'Imagen';
    return `<img${attrs} alt="${alt}" src="https://placehold.co/600x360/e2e8f0/334155?text=${encodeURIComponent(alt)}" />`;
  }
  if (node.tag === 'input') {
    return `<input${attrs} type="text" placeholder="${content}" />`;
  }
  if (node.tag === 'textarea') {
    return `<textarea${attrs} placeholder="${content}"></textarea>`;
  }
  if (node.tag === 'a') {
    return `<a${attrs} href="#">${content}${childrenHtml}</a>`;
  }
  return `<${node.tag}${attrs}>${content}${childrenHtml}</${node.tag}>`;
}

export function previewDocument(html: string): string {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { margin: 0; padding: 1rem; background: #f8fafc; font-family: ui-sans-serif, system-ui, sans-serif; }
      * { box-sizing: border-box; }
    </style>
  </head>
  <body>${html}</body>
</html>`;
}

export function walkTree(tree: BuilderNode[]): BuilderNode[] {
  const out: BuilderNode[] = [];
  for (const node of tree) {
    out.push(node);
    out.push(...walkTree(node.children));
  }
  return out;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

