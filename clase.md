# Clase práctica: Tailwind CSS con Builder Visual + React

## 1) Objetivo de la clase

Al finalizar la sesión, el estudiante podrá:

- Entender qué es Tailwind CSS y su enfoque *utility-first*.
- Diferenciar Tailwind de CSS tradicional y de Bootstrap.
- Construir un componente paso a paso usando el builder visual.
- Construir un layout completo (header, sidebar, content, footer).
- Completar una evaluación guiada con puntuación.
- Replicar lo aprendido en un proyecto propio con Vite + React.

---

## 2) Fundamentos teóricos de Tailwind CSS

### 2.1 ¿Qué es Tailwind CSS?

Tailwind CSS es un framework CSS basado en clases utilitarias pequeñas y composables.

Ejemplo:

```html
<button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
  Guardar
</button>
```

Cada clase representa una regla concreta:

- `bg-blue-600` => color de fondo
- `text-white` => color de texto
- `px-4 py-2` => padding horizontal/vertical
- `rounded-lg` => esquinas redondeadas
- `hover:bg-blue-700` => estado hover

### 2.2 Conceptos básicos

- **Utilities**: clases unitarias (espaciado, color, tipografía, layout).
- **Responsive design**: prefijos por breakpoint (`sm:`, `md:`, `lg:`, `xl:`).
- **State variants**: estados (`hover:`, `focus:`, `focus-visible:`, `disabled:`).
- **Composición**: combinar muchas clases simples para formar el diseño final.

### 2.3 Semejanzas y diferencias con CSS tradicional

Semejanzas:

- Ambos terminan aplicando reglas CSS al DOM.
- Ambos permiten controlar layout, tipografía, color, etc.

Diferencias:

- CSS tradicional: creas clases semánticas propias (`.btn-primary`) y escribes reglas en archivos `.css`.
- Tailwind: usas utilidades directamente en el HTML/JSX y compones visualmente.
- Tailwind suele reducir el cambio de contexto (menos saltos entre HTML y CSS).
- CSS tradicional suele tener mayor riesgo de cascada global y especificidad compleja.

### 2.4 Semejanzas y diferencias con Bootstrap

Semejanzas:

- Ambos aceleran construcción de interfaces.
- Ambos incluyen utilidades para spacing, grid, color, etc.

Diferencias clave:

- Bootstrap es más “componente predefinido” (botones, cards, navbars con estilos opinados).
- Tailwind es más “bloques atómicos” para construir diseño propio desde cero.
- Bootstrap tiende a look más homogéneo por defecto.
- Tailwind da mayor libertad creativa sin sobrescribir tantas reglas base.

---

## 3) Uso académico del builder visual

Este builder es útil en clase porque:

- Permite aprender Tailwind sin empezar escribiendo código.
- Hace visible la relación entre:
  - Estructura (Mapa)
  - Apariencia (Vista previa)
  - Resultado técnico (Código generado)
- Facilita evaluación por rúbricas y niveles de dificultad.
- Sirve como puente hacia implementación real en React.

Buenas prácticas pedagógicas:

- Empezar con “qué hace cada categoría de clases”.
- Forzar primero semántica (tags correctos), luego estilo.
- Validar accesibilidad básica (contraste, focus visible, jerarquía de títulos).
- Cerrar con transferencia a proyecto real (`Vite + React`).

---

## 4) Estructura sugerida de la sesión (120 minutos)

- 0-20 min: teoría y comparación CSS/Tailwind/Bootstrap.
- 20-45 min: práctica 1 (componente).
- 45-80 min: práctica 2 (layout).
- 80-105 min: demostración de evaluación multinivel.
- 105-120 min: reto final y lineamientos del proyecto individual.

---

## 5) Práctica 1: componente paso a paso (modo “Diseño de componente”)

### Objetivo

Construir una card simple:

- contenedor con borde, sombra y padding;
- título;
- descripción;
- botón de acción.

### Paso a paso

1. Abrir pestaña `Diseño de componente`.
2. Cargar ejemplo preelaborado o empezar desde nodo raíz.
3. En el Mapa, seleccionar el nodo contenedor.
4. Asignar clases al contenedor:
   - `max-w-sm`, `rounded-xl`, `border`, `bg-white`, `p-6`, `shadow-sm`
5. Agregar nodo hijo para el título (`h3`) y clases:
   - `text-lg`, `font-semibold`, `text-slate-900`
6. Agregar nodo hijo para texto (`p`) y clases:
   - `mt-2`, `text-sm`, `text-slate-700`
7. Agregar nodo hijo botón (`button`) y clases:
   - `mt-4`, `rounded-lg`, `bg-blue-600`, `px-4`, `py-2`, `text-white`, `hover:bg-blue-700`
8. Revisar `Vista previa`.
9. Revisar `Código generado`.
10. Guardar el componente para usarlo luego en layout.

### Criterios de logro

- Estructura semántica correcta.
- Espaciado consistente.
- Contraste legible.
- Botón con estado hover.

---

## 6) Práctica 2: layout paso a paso (modo “Diseño de layout”)

### Objetivo

Construir un layout de aplicación:

- Header superior
- Sidebar lateral
- Content principal
- Footer inferior

### Paso a paso

1. Abrir pestaña `Diseño de layout`.
2. Definir clases de página (`pageClasses`) y shell (`shellClasses`).
3. Configurar `headerClasses`, `sidebarClasses`, `contentClasses`, `footerClasses` usando selector por categoría.
4. Activar/desactivar sidebar según el caso.
5. Completar títulos y contenidos base.
6. Insertar componentes guardados en cada sección:
   - Header: por ejemplo logo + botón.
   - Sidebar: menú con varios botones.
   - Content: card o tabla.
   - Footer: bloque informativo.
7. Probar preview en `Desktop / Tablet / Mobile`.
8. Exportar HTML del layout.

### Criterios de logro

- Jerarquía visual clara.
- Adaptabilidad responsive.
- Reutilización de componentes.
- Coherencia de estilos entre secciones.

---

## 7) Demostración de evaluación (modo “Evaluación”)

### Objetivo

Mostrar cómo funciona evaluación por niveles con score 0-100.

### Flujo recomendado para el docente

1. Abrir pestaña `Evaluación`.
2. Seleccionar nivel (1 a 5).
3. Mostrar `Diseño objetivo`.
4. Construir solución en el editor del estudiante.
5. Presionar `Evaluar`.
6. Analizar score y rúbrica:
   - qué criterios pasaron,
   - cuáles no,
   - cómo corregir.

### Enfoque pedagógico

- Nivel 1-2: foco en fundamentos (spacing, tipografía, color).
- Nivel 3-4: foco en estructura y composición.
- Nivel 5: foco en layout interno y consistencia.

---

## 8) Errores comunes y cómo corregirlos

- **Error**: usar tags incorrectos (`div` para todo).
  - **Corrección**: usar `h*`, `p`, `button`, `nav`, `section` según propósito.

- **Error**: diseño “pegado” sin espaciado.
  - **Corrección**: aplicar `p-*`, `m-*`, `gap-*`, `mt-*`.

- **Error**: falta de contraste.
  - **Corrección**: validar combinaciones de `bg-*` + `text-*`.

- **Error**: no hay estados interactivos.
  - **Corrección**: agregar `hover:*`, `focus-visible:*`.

- **Error**: no validar en responsive.
  - **Corrección**: revisar desktop/tablet/mobile y usar prefijos `md:`, `lg:`.

---

## 9) Reto final (trabajo autónomo): implementarlo en Vite + React

## Enunciado del reto

Crear una mini aplicación React que tenga:

- un layout completo (header, sidebar, content, footer),
- al menos 3 componentes reutilizables,
- estilos con Tailwind CSS,
- y una vista responsive funcional.

### Requisitos mínimos

1. Proyecto creado con `Vite + React`.
2. Tailwind CSS configurado correctamente.
3. 3 componentes propios:
   - `PrimaryButton`
   - `SidebarMenu`
   - `InfoCard` (o equivalente)
4. Layout principal con composición de componentes.
5. Modo responsive:
   - desktop
   - tablet
   - móvil
6. Estados interactivos visibles (`hover` y `focus-visible`).
7. README breve con decisiones de diseño.

### Entregables

- Repositorio Git (o zip del proyecto).
- Capturas desktop/tablet/mobile.
- Lista de utilidades Tailwind más usadas y por qué.

### Rúbrica sugerida (100 puntos)

- Estructura semántica y accesibilidad: 20
- Composición de componentes reutilizables: 20
- Calidad visual y consistencia: 20
- Responsive real (no solo “que no se rompa”): 20
- Claridad técnica/documentación: 20

---

## 10) Cierre y reflexión

Preguntas de cierre para estudiantes:

1. ¿Qué fue más rápido con Tailwind que con CSS tradicional?
2. ¿Qué parte fue más difícil de componer?
3. ¿Cuándo preferirías Bootstrap en vez de Tailwind?
4. ¿Qué mejoras harías al builder visual para aprender mejor?

Resultado esperado:

- El estudiante entiende Tailwind no solo como “clases”, sino como sistema de diseño composable.
- Puede transferir lo practicado del builder a un proyecto real en React.

