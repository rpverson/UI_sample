# Guía (docentes)

## Diseño de un buen reto

- Define 3-6 checks claros sobre el arbol: semantica, texto, estados, layout base.
- Acepta variación: valida **clases clave** en vez de exigir todas las clases.
- Empieza con lo importante: accesibilidad + estructura antes que “pixel-perfect”.

## Cómo agregar retos

1. Ejecuta `npm run challenge:new -- id "Título"`.
2. Edita:
   - `src/challenges/registry.ts` (`starterTree` + `validate`)
   - `src/challenges/<id>/<id>.spec.tsx` (tests del validador)

## Sugerencias de evaluación

- Pide PRs por reto o por “unidad”.
- Puntúa por checks: (A11y) + (estructura) + (estilo) + (estados).
- Para evitar spoilers, guarda soluciones completas en otro branch o repo privado.
