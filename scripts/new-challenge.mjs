import fs from 'node:fs/promises';
import path from 'node:path';

const [id, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(' ').trim();

if (!id || !title) {
  console.error('Uso: npm run challenge:new -- <id> "Titulo del reto"');
  process.exit(1);
}

const root = process.cwd();
const challengeDir = path.join(root, 'src', 'challenges', id);
const specPath = path.join(challengeDir, `${id}.spec.tsx`);
const registryPath = path.join(root, 'src', 'challenges', 'registry.ts');

await fs.mkdir(challengeDir, { recursive: true });

await fs.writeFile(
  specPath,
  `import { describe, expect, it } from 'vitest';\nimport { challenges } from '../registry';\nimport type { BuilderNode } from '../../builder/types';\n\ndescribe('${id}', () => {\n  const challenge = challenges.find((item) => item.id === '${id}');\n\n  it('deberia validar un arbol valido (TODO)', () => {\n    const tree: BuilderNode[] = [];\n    const checks = challenge!.validate(tree);\n    expect(checks.length).toBeGreaterThan(0);\n  });\n});\n`,
  { encoding: 'utf8', flag: 'wx' }
).catch((err) => {
  if (err?.code !== 'EEXIST') throw err;
  console.error(`Ya existe: ${specPath}`);
  process.exit(1);
});

const registry = await fs.readFile(registryPath, 'utf8');
if (!registry.includes('// <challenge-add-marker>')) {
  console.error('No existe el marcador // <challenge-add-marker> en src/challenges/registry.ts');
  process.exit(1);
}
if (registry.includes(`id: '${id}'`)) {
  console.error(`El reto ya esta registrado: ${id}`);
  process.exit(1);
}

const entry = `  {\n    id: '${id}',\n    title: '${escapeForTs(title)}',\n    description: 'TODO: describe objetivo y criterios.',\n    starterTree: [],\n    validate: (tree) => {\n      const _tree = tree;\n      return [\n        { id: '${id}-todo', label: 'Define checks para este reto', passed: _tree.length > -1 }\n      ];\n    }\n  },\n  // <challenge-add-marker>`;

const updated = registry.replace('// <challenge-add-marker>', entry);
await fs.writeFile(registryPath, updated, 'utf8');

console.log(`Reto creado: ${id}`);
console.log(`- Tests: ${path.relative(root, specPath)}`);
console.log(`- Registry actualizado: src/challenges/registry.ts`);

function escapeForTs(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

