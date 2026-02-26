# Tailwind UI Classroom

Herramienta para enseñar y practicar UIs con Tailwind CSS mediante un **builder visual** (sin escribir HTML manual) + **retos con validación automática**.

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm

## Empezar

```bash
npm install
npm run dev
```

## Retos (cómo funciona)

- Los alumnos construyen la UI en el builder visual (árbol de tags + clases Tailwind).
- Cada reto define checks sobre el árbol en `src/challenges/registry.ts`.
- Los tests validan esos checks en `src/challenges/<id>/<id>.spec.tsx`.
- Para validar:

```bash
npm test
```

### Ejecutar solo un reto

Vitest acepta un path como filtro:

```bash
npm test -- src/challenges/button-primary
```

## Recomendaciones para tests (para clase real)

- Prioriza **semántica y accesibilidad**: `getByRole`, labels, headings.
- Valida Tailwind con `toHaveClass('...')` para clases clave (no fuerces todas).
- Evita snapshots gigantes: se vuelven frágiles cuando cambia el HTML.

## Crear un nuevo reto (scaffold)

```bash
npm run challenge:new -- id-del-reto "Título del reto"
```

Esto crea:

- `src/challenges/id-del-reto/id-del-reto.spec.tsx` (test base)
- entrada inicial en `src/challenges/registry.ts` con `starterTree` y `validate`.

## Nota sobre `base.md`

`base.md` fue la referencia original del builder. Esta app retoma ese flujo visual y elimina Firebase para hacerlo más simple en clase.

## Documentación

- Alumnos: `docs/STUDENTS.md`
- Docente: `docs/TEACHERS.md`
