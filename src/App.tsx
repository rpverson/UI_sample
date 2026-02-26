import {
  createElement,
  useEffect,
  useMemo,
  useState,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes
} from 'react';
import {
  addChildNode,
  createNode,
  findNodeById,
  htmlTags,
  predefinedExamples,
  removeNode,
  serializeHtml,
  tailwindClassesGrouped,
  updateNode,
  walkTree
} from './builder/core';
import type { BuilderNode } from './builder/types';

type SelectTagValue = BuilderNode['tag'] | 'text';
type PreviewSize = 'desktop' | 'tablet' | 'mobile';
type DesignMode = 'component' | 'layout' | 'evaluation';
type EvaluationCheck = { label: string; weight: number; passed: boolean };
type EvaluationScenario = {
  id: string;
  name: string;
  level: string;
  description: string;
  targetTree: BuilderNode[];
  starterTree: BuilderNode[];
};

type LayoutConfig = {
  pageClasses: string;
  headerClasses: string;
  shellClasses: string;
  sidebarClasses: string;
  contentClasses: string;
  footerClasses: string;
  headerComponentIds: string[];
  sidebarComponentIds: string[];
  contentComponentIds: string[];
  footerComponentIds: string[];
  headerTitle: string;
  sidebarTitle: string;
  sidebarBody: string;
  contentTitle: string;
  contentBody: string;
  footerText: string;
  showSidebar: boolean;
};

type SavedComponent = {
  id: string;
  name: string;
  tree: BuilderNode[];
};

const initialTree: BuilderNode[] = [
  {
    id: 'root-div',
    tag: 'div',
    content: '',
    classes: ['bg-blue-500'],
    children: [
      {
        id: 'root-text',
        tag: 'p',
        content: 'text',
        classes: ['font-bold'],
        children: []
      }
    ]
  }
];

const evaluationStarterTree: BuilderNode[] = [
  {
    id: 'eval-root',
    tag: 'div',
    content: '',
    classes: [],
    children: []
  }
];

const evaluationScenarios: EvaluationScenario[] = [
  {
    id: 'level-1-card',
    name: 'Nivel 1 - Card básica',
    level: 'Fácil',
    description: 'Replica una card simple con título, texto y botón.',
    starterTree: cloneTreeWithPrefix(evaluationStarterTree, 'lvl1'),
    targetTree: [
      {
        id: 'lvl1-target-card',
        tag: 'div',
        content: '',
        classes: ['max-w-sm', 'rounded-xl', 'border', 'border-slate-200', 'bg-white', 'p-6', 'shadow-sm'],
        children: [
          { id: 'lvl1-title', tag: 'h3', content: 'Tarjeta de Curso', classes: ['text-lg', 'font-semibold', 'text-slate-900'], children: [] },
          { id: 'lvl1-text', tag: 'p', content: 'Aprende Tailwind CSS creando interfaces reales.', classes: ['mt-2', 'text-sm', 'text-slate-700'], children: [] },
          { id: 'lvl1-btn', tag: 'button', content: 'Comenzar', classes: ['mt-2', 'rounded-lg', 'bg-blue-600', 'px-4', 'py-2', 'text-white', 'hover:bg-blue-700'], children: [] }
        ]
      }
    ]
  },
  {
    id: 'level-2-hero',
    name: 'Nivel 2 - Hero compacto',
    level: 'Fácil/Medio',
    description: 'Construye un bloque hero con título centrado y CTA.',
    starterTree: cloneTreeWithPrefix(evaluationStarterTree, 'lvl2'),
    targetTree: [
      {
        id: 'lvl2-hero',
        tag: 'section',
        content: '',
        classes: ['w-full', 'max-w-sm', 'mx-auto', 'rounded-xl', 'bg-slate-900', 'p-6'],
        children: [
          { id: 'lvl2-title', tag: 'h2', content: 'Domina Tailwind', classes: ['text-xl', 'font-bold', 'text-white', 'text-center'], children: [] },
          { id: 'lvl2-copy', tag: 'p', content: 'Crea interfaces limpias y modernas.', classes: ['mt-2', 'text-sm', 'text-white', 'text-center'], children: [] },
          { id: 'lvl2-btn', tag: 'button', content: 'Inscribirme', classes: ['mt-2', 'rounded-lg', 'bg-blue-600', 'px-4', 'py-2', 'text-white'], children: [] }
        ]
      }
    ]
  },
  {
    id: 'level-3-toolbar',
    name: 'Nivel 3 - Toolbar',
    level: 'Medio',
    description: 'Crea una barra superior con título y dos acciones.',
    starterTree: cloneTreeWithPrefix(evaluationStarterTree, 'lvl3'),
    targetTree: [
      {
        id: 'lvl3-toolbar',
        tag: 'div',
        content: '',
        classes: ['w-full', 'rounded-lg', 'border', 'border-slate-200', 'bg-white', 'p-4', 'shadow-sm', 'flex', 'justify-between', 'items-center'],
        children: [
          { id: 'lvl3-label', tag: 'p', content: 'Panel de control', classes: ['text-base', 'font-semibold', 'text-slate-900'], children: [] },
          {
            id: 'lvl3-actions',
            tag: 'div',
            content: '',
            classes: ['flex', 'gap-2'],
            children: [
              { id: 'lvl3-btn1', tag: 'button', content: 'Filtrar', classes: ['rounded', 'border', 'border-slate-200', 'px-3', 'py-2'], children: [] },
              { id: 'lvl3-btn2', tag: 'button', content: 'Nuevo', classes: ['rounded', 'bg-blue-600', 'px-3', 'py-2', 'text-white'], children: [] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'level-4-profile',
    name: 'Nivel 4 - Perfil',
    level: 'Medio/Avanzado',
    description: 'Diseña una card de perfil con cabecera y acciones.',
    starterTree: cloneTreeWithPrefix(evaluationStarterTree, 'lvl4'),
    targetTree: [
      {
        id: 'lvl4-card',
        tag: 'article',
        content: '',
        classes: ['max-w-sm', 'rounded-xl', 'border', 'border-slate-200', 'bg-white', 'p-6', 'shadow-md'],
        children: [
          { id: 'lvl4-head', tag: 'h3', content: 'María López', classes: ['text-lg', 'font-semibold', 'text-slate-900'], children: [] },
          { id: 'lvl4-role', tag: 'p', content: 'Frontend Developer', classes: ['mt-2', 'text-sm', 'text-slate-700'], children: [] },
          { id: 'lvl4-stat', tag: 'p', content: 'Proyectos: 12', classes: ['mt-2', 'text-sm', 'font-medium', 'text-slate-900'], children: [] },
          {
            id: 'lvl4-cta-wrap',
            tag: 'div',
            content: '',
            classes: ['mt-2', 'flex', 'gap-2'],
            children: [
              { id: 'lvl4-cta1', tag: 'button', content: 'Mensaje', classes: ['rounded-lg', 'bg-blue-600', 'px-3', 'py-2', 'text-white'], children: [] },
              { id: 'lvl4-cta2', tag: 'button', content: 'Seguir', classes: ['rounded-lg', 'border', 'border-slate-200', 'px-3', 'py-2'], children: [] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'level-5-mini-dashboard',
    name: 'Nivel 5 - Mini dashboard',
    level: 'Avanzado',
    description: 'Construye un mini dashboard con header, bloque de métricas y acciones.',
    starterTree: cloneTreeWithPrefix(evaluationStarterTree, 'lvl5'),
    targetTree: [
      {
        id: 'lvl5-root',
        tag: 'section',
        content: '',
        classes: ['w-full', 'max-w-sm', 'mx-auto', 'rounded-xl', 'border', 'border-slate-200', 'bg-white', 'p-6', 'shadow-md'],
        children: [
          {
            id: 'lvl5-head',
            tag: 'div',
            content: '',
            classes: ['flex', 'justify-between', 'items-center'],
            children: [
              { id: 'lvl5-title', tag: 'h3', content: 'Dashboard', classes: ['text-lg', 'font-semibold', 'text-slate-900'], children: [] },
              { id: 'lvl5-btn', tag: 'button', content: 'Actualizar', classes: ['rounded', 'bg-blue-600', 'px-3', 'py-2', 'text-white', 'hover:bg-blue-700'], children: [] }
            ]
          },
          {
            id: 'lvl5-metrics',
            tag: 'div',
            content: '',
            classes: ['mt-2', 'flex', 'gap-2'],
            children: [
              { id: 'lvl5-m1', tag: 'div', content: 'Ventas 120', classes: ['rounded', 'bg-slate-50', 'p-3', 'text-sm', 'font-medium'], children: [] },
              { id: 'lvl5-m2', tag: 'div', content: 'Leads 80', classes: ['rounded', 'bg-slate-50', 'p-3', 'text-sm', 'font-medium'], children: [] }
            ]
          }
        ]
      }
    ]
  }
];

const tagOptions: SelectTagValue[] = ['text', ...htmlTags];

const defaultLayout: LayoutConfig = {
  pageClasses: 'min-h-screen bg-slate-50 p-6',
  headerClasses: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm',
  shellClasses: 'mt-4 grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr]',
  sidebarClasses: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm',
  contentClasses: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm',
  footerClasses: 'mt-4 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600',
  headerComponentIds: [],
  sidebarComponentIds: [],
  contentComponentIds: [],
  footerComponentIds: [],
  headerTitle: 'Mi sitio web',
  sidebarTitle: 'Navegación',
  sidebarBody: 'Dashboard\nCursos\nRecursos\nPerfil',
  contentTitle: 'Contenido principal',
  contentBody: 'Aquí va el contenido principal de la página.',
  footerText: '© 2026 Mi sitio',
  showSidebar: true
};

export default function App() {
  const [mode, setMode] = useState<DesignMode>('component');
  const [tree, setTree] = useState<BuilderNode[]>(clone(initialTree));
  const [selectedId, setSelectedId] = useState<string | null>('root-text');
  const [previewSize, setPreviewSize] = useState<PreviewSize>('desktop');
  const [layoutPreviewSize, setLayoutPreviewSize] = useState<PreviewSize>('desktop');
  const [copyState, setCopyState] = useState<'idle' | 'done'>('idle');
  const [classQuery, setClassQuery] = useState('');
  const [selectedClassCategory, setSelectedClassCategory] = useState<string>(tailwindClassesGrouped[0]?.category ?? '');
  const [selectedExample, setSelectedExample] = useState('');
  const [componentName, setComponentName] = useState('');
  const [savedComponents, setSavedComponents] = useState<SavedComponent[]>([]);
  const [layout, setLayout] = useState<LayoutConfig>(defaultLayout);
  const [layoutCopyState, setLayoutCopyState] = useState<'idle' | 'done'>('idle');
  const [evaluationScenarioId, setEvaluationScenarioId] = useState<string>(evaluationScenarios[0].id);
  const [evaluationTree, setEvaluationTree] = useState<BuilderNode[]>(clone(evaluationScenarios[0].starterTree));
  const [evaluationSelectedId, setEvaluationSelectedId] = useState<string | null>(evaluationScenarios[0].starterTree[0]?.id ?? null);
  const [evaluationClassQuery, setEvaluationClassQuery] = useState('');
  const [evaluationClassCategory, setEvaluationClassCategory] = useState<string>(tailwindClassesGrouped[0]?.category ?? '');
  const [evaluationPreviewSize, setEvaluationPreviewSize] = useState<PreviewSize>('desktop');
  const [evaluationScore, setEvaluationScore] = useState<number | null>(null);
  const [evaluationChecks, setEvaluationChecks] = useState<EvaluationCheck[]>([]);

  const selectedNode = useMemo(() => findNodeById(tree, selectedId), [tree, selectedId]);
  const selectedLevel = selectedId ? findLevel(tree, selectedId) : 0;
  const generatedCode = useMemo(() => serializeHtml(tree), [tree]);
  const evaluationNode = useMemo(
    () => findNodeById(evaluationTree, evaluationSelectedId),
    [evaluationTree, evaluationSelectedId]
  );
  const evaluationScenario = useMemo(
    () => evaluationScenarios.find((scenario) => scenario.id === evaluationScenarioId) ?? evaluationScenarios[0],
    [evaluationScenarioId]
  );
  const evaluationLevel = evaluationSelectedId ? findLevel(evaluationTree, evaluationSelectedId) : 0;
  const evaluationCode = useMemo(() => serializeHtml(evaluationTree), [evaluationTree]);
  const layoutCode = useMemo(() => serializeLayout(layout, savedComponents), [layout, savedComponents]);
  const filteredCategoryClasses = useMemo(() => {
    const group = tailwindClassesGrouped.find((item) => item.category === selectedClassCategory);
    if (!group) return [];
    const query = classQuery.trim().toLowerCase();
    if (!query) return group.classes;
    return group.classes.filter((klass) => klass.toLowerCase().includes(query));
  }, [classQuery, selectedClassCategory]);
  const evaluationFilteredClasses = useMemo(() => {
    const group = tailwindClassesGrouped.find((item) => item.category === evaluationClassCategory);
    if (!group) return [];
    const query = evaluationClassQuery.trim().toLowerCase();
    if (!query) return group.classes;
    return group.classes.filter((klass) => klass.toLowerCase().includes(query));
  }, [evaluationClassCategory, evaluationClassQuery]);

  useEffect(() => {
    if (tree.length === 0) {
      if (selectedId !== null) setSelectedId(null);
      return;
    }
    if (!selectedId || !findNodeById(tree, selectedId)) {
      setSelectedId(tree[0].id);
    }
  }, [tree, selectedId]);

  useEffect(() => {
    if (evaluationTree.length === 0) {
      if (evaluationSelectedId !== null) setEvaluationSelectedId(null);
      return;
    }
    if (!evaluationSelectedId || !findNodeById(evaluationTree, evaluationSelectedId)) {
      setEvaluationSelectedId(evaluationTree[0].id);
    }
  }, [evaluationTree, evaluationSelectedId]);

  useEffect(() => {
    const next = clone(evaluationScenario.starterTree);
    setEvaluationTree(next);
    setEvaluationSelectedId(next[0]?.id ?? null);
    setEvaluationScore(null);
    setEvaluationChecks([]);
  }, [evaluationScenario]);

  const selectedTagValue: SelectTagValue = selectedNode
    ? selectedNode.tag === 'p' && selectedNode.content === 'text'
      ? 'text'
      : selectedNode.tag
    : 'text';

  const setSelectedTag = (value: SelectTagValue) => {
    if (!selectedNode) return;
    if (value === 'text') {
      updateSelectedNode({ tag: 'p', content: selectedNode.content || 'text' });
      return;
    }
    updateSelectedNode({ tag: value });
  };

  const updateSelectedNode = (patch: Partial<BuilderNode>) => {
    if (!selectedId) return;
    setTree((prev) => updateNode(prev, selectedId, (node) => ({ ...node, ...patch })));
  };

  const addClass = (klass: string) => {
    if (!selectedNode || !klass || selectedNode.classes.includes(klass)) return;
    updateSelectedNode({ classes: [...selectedNode.classes, klass] });
  };

  const removeClass = (klass: string) => {
    if (!selectedNode) return;
    updateSelectedNode({ classes: selectedNode.classes.filter((item) => item !== klass) });
  };

  const addChild = () => {
    if (!selectedId) return;
    const child = createNode('p', 'text');
    setTree((prev) => addChildNode(prev, selectedId, child));
    setSelectedId(child.id);
  };

  const addRoot = () => {
    const root = createNode('div', '');
    setTree((prev) => [...prev, root]);
    setSelectedId(root.id);
  };

  const loadExample = () => {
    const example = predefinedExamples.find((item) => item.name === selectedExample);
    if (!example) return;
    const next = clone(example.tree);
    setTree(next);
    setSelectedId(next[0]?.id ?? null);
  };

  const saveCurrentComponent = () => {
    const name = componentName.trim();
    if (!name || tree.length === 0) return;
    const item: SavedComponent = {
      id: `cmp-${Date.now()}`,
      name,
      tree: clone(tree)
    };
    setSavedComponents((prev) => [item, ...prev]);
    setComponentName('');
  };

  const loadSavedComponent = (componentId: string) => {
    const item = savedComponents.find((entry) => entry.id === componentId);
    if (!item) return;
    const next = clone(item.tree);
    setTree(next);
    setSelectedId(next[0]?.id ?? null);
  };

  const deleteSavedComponent = (componentId: string) => {
    setSavedComponents((prev) => prev.filter((entry) => entry.id !== componentId));
    setLayout((prev) => ({
      ...prev,
      headerComponentIds: prev.headerComponentIds.filter((id) => id !== componentId),
      sidebarComponentIds: prev.sidebarComponentIds.filter((id) => id !== componentId),
      contentComponentIds: prev.contentComponentIds.filter((id) => id !== componentId),
      footerComponentIds: prev.footerComponentIds.filter((id) => id !== componentId)
    }));
  };

  const deleteNode = () => {
    if (!selectedId) return;
    setTree((prev) => removeNode(prev, selectedId));
  };

  const downloadHtml = () => {
    const file = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'componente.html';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopyState('done');
    setTimeout(() => setCopyState('idle'), 1200);
  };

  const copyLayoutCode = async () => {
    await navigator.clipboard.writeText(layoutCode);
    setLayoutCopyState('done');
    setTimeout(() => setLayoutCopyState('idle'), 1200);
  };

  const downloadLayoutHtml = () => {
    const file = new Blob([layoutCode], { type: 'text/html' });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'layout.html';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const evaluationTagValue: SelectTagValue = evaluationNode
    ? evaluationNode.tag === 'p' && evaluationNode.content === 'text'
      ? 'text'
      : evaluationNode.tag
    : 'text';

  const updateEvaluationNode = (patch: Partial<BuilderNode>) => {
    if (!evaluationSelectedId) return;
    setEvaluationTree((prev) =>
      updateNode(prev, evaluationSelectedId, (node) => ({
        ...node,
        ...patch
      }))
    );
  };

  const addEvaluationClass = (klass: string) => {
    if (!evaluationNode || !klass || evaluationNode.classes.includes(klass)) return;
    updateEvaluationNode({ classes: [...evaluationNode.classes, klass] });
  };

  const removeEvaluationClass = (klass: string) => {
    if (!evaluationNode) return;
    updateEvaluationNode({ classes: evaluationNode.classes.filter((item) => item !== klass) });
  };

  const addEvaluationRoot = () => {
    const node = createNode('div', '');
    setEvaluationTree((prev) => [...prev, node]);
    setEvaluationSelectedId(node.id);
  };

  const addEvaluationChild = () => {
    if (!evaluationSelectedId) return;
    const child = createNode('p', 'text');
    setEvaluationTree((prev) => addChildNode(prev, evaluationSelectedId, child));
    setEvaluationSelectedId(child.id);
  };

  const deleteEvaluationNode = () => {
    if (!evaluationSelectedId) return;
    setEvaluationTree((prev) => removeNode(prev, evaluationSelectedId));
  };

  const resetEvaluation = () => {
    const next = clone(evaluationScenario.starterTree);
    setEvaluationTree(next);
    setEvaluationSelectedId(next[0]?.id ?? null);
    setEvaluationScore(null);
    setEvaluationChecks([]);
  };

  const evaluateSubmission = () => {
    const checks = runEvaluationChecks(evaluationTree, evaluationScenario.id);
    const score = Math.round(checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0));
    setEvaluationChecks(checks);
    setEvaluationScore(score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tailwind UI Lab</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Builder visual basado en estilo chadcn</h1>
          <p className="mt-1 text-sm text-slate-600">Cambia entre diseño de componentes y diseño de layout completo.</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setMode('component')}
              className={`inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium ${
                mode === 'component' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              Diseño de componente
            </button>
            <button
              type="button"
              onClick={() => setMode('layout')}
              className={`inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium ${
                mode === 'layout' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              Diseño de layout
            </button>
            <button
              type="button"
              onClick={() => setMode('evaluation')}
              className={`inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium ${
                mode === 'evaluation' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              Evaluación
            </button>
          </div>
        </header>

        {mode === 'component' ? (
          <div className="grid gap-5 xl:grid-cols-12">
          <section className="space-y-5 xl:col-span-4">
            <Card title="Crea tu componente" description="Edita el nodo seleccionado">
              <ControlLabel>Ejemplos preelaborados</ControlLabel>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Select
                  value={selectedExample}
                  onChange={(event) => setSelectedExample(event.target.value)}
                >
                  <option value="">Selecciona un ejemplo</option>
                  {predefinedExamples.map((example) => (
                    <option key={example.name} value={example.name}>
                      {example.name}
                    </option>
                  ))}
                </Select>
                <Button variant="outline" onClick={loadExample}>
                  Cargar
                </Button>
              </div>

              <ControlLabel>Guardar componente creado</ControlLabel>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  value={componentName}
                  onChange={(event) => setComponentName(event.target.value)}
                  placeholder="Nombre del componente"
                />
                <Button onClick={saveCurrentComponent}>Guardar</Button>
              </div>

              <ControlLabel>Etiqueta HTML</ControlLabel>
              <Select
                value={selectedTagValue}
                onChange={(event) => setSelectedTag(event.target.value as SelectTagValue)}
                disabled={!selectedNode}
              >
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </Select>

              <ControlLabel>Nivel</ControlLabel>
              <Input readOnly value={selectedLevel} />

              <ControlLabel>Contenido</ControlLabel>
              <Input
                value={selectedNode?.content ?? ''}
                onChange={(event) => updateSelectedNode({ content: event.target.value })}
                placeholder="Texto del elemento"
                disabled={!selectedNode}
              />

              <ControlLabel>Clases Tailwind</ControlLabel>
              <Select
                value={selectedClassCategory}
                onChange={(event) => setSelectedClassCategory(event.target.value)}
                disabled={!selectedNode}
              >
                {tailwindClassesGrouped.map((group) => (
                  <option key={group.category} value={group.category}>
                    {group.category}
                  </option>
                ))}
              </Select>
              <Input
                value={classQuery}
                onChange={(event) => setClassQuery(event.target.value)}
                placeholder="Buscar clase... ej: bg-, text-, rounded"
                disabled={!selectedNode}
              />
              <div className="mt-2 max-h-44 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-2">
                {!selectedNode && <p className="text-xs text-slate-500">Selecciona un nodo para agregar clases.</p>}
                {selectedNode && filteredCategoryClasses.length === 0 && (
                  <p className="text-xs text-slate-500">No hay clases que coincidan con &quot;{classQuery}&quot;.</p>
                )}
                {selectedNode && (
                  <div className="flex flex-wrap gap-1.5">
                    {filteredCategoryClasses.map((klass) => (
                      <button
                        key={klass}
                        type="button"
                        onClick={() => addClass(klass)}
                        className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-100"
                      >
                        {klass}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(selectedNode?.classes ?? []).map((klass) => (
                  <button
                    key={klass}
                    type="button"
                    onClick={() => removeClass(klass)}
                    className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    {klass} ×
                  </button>
                ))}
                {selectedNode && selectedNode.classes.length === 0 && (
                  <span className="text-xs text-slate-500">Este nodo no tiene clases.</span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button onClick={addRoot}>Agregar raíz</Button>
                <Button onClick={addChild}>Agregar hijo</Button>
                <Button variant="outline" onClick={deleteNode}>
                  Eliminar nodo
                </Button>
              </div>
            </Card>

            <Card title="Mapa" description="Selecciona el nodo que quieres editar">
              <div className="space-y-2">
                {tree.map((node) => (
                  <MapNode
                    key={node.id}
                    node={node}
                    level={0}
                    selectedId={selectedId}
                    onSelect={(id) => setSelectedId(id)}
                  />
                ))}
              </div>
            </Card>

            <Card title="Componentes guardados" description="Úsalos después en diseño de layout">
              {savedComponents.length === 0 && (
                <p className="text-sm text-slate-500">Todavía no has guardado componentes.</p>
              )}
              <div className="space-y-2">
                {savedComponents.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-2 py-2">
                    <button
                      type="button"
                      onClick={() => loadSavedComponent(item.id)}
                      className="text-sm font-medium text-slate-800 hover:underline"
                    >
                      {item.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSavedComponent(item.id)}
                      className="text-xs text-rose-700 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="space-y-5 xl:col-span-8">
            <Card title="Vista previa" description="Render en sandbox con Tailwind CDN">
              <div className="mb-3 flex items-center gap-2">
                <SizePill size="desktop" current={previewSize} onChange={setPreviewSize} />
                <SizePill size="tablet" current={previewSize} onChange={setPreviewSize} />
                <SizePill size="mobile" current={previewSize} onChange={setPreviewSize} />
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                <div
                  className={`mx-auto h-[390px] overflow-auto rounded-md border border-slate-300 bg-white p-4 ${
                    previewSize === 'desktop' ? 'w-full' : previewSize === 'tablet' ? 'w-[760px] max-w-full' : 'w-[360px]'
                  }`}
                >
                  {tree.map((node) => renderPreviewNode(node))}
                </div>
              </div>
            </Card>

            <Card title="Código generado" description="HTML listo para copiar o descargar">
              <div className="mb-3 flex gap-2">
                <Button onClick={copyCode}>{copyState === 'done' ? 'Copiado' : 'Copiar código'}</Button>
                <Button variant="outline" onClick={downloadHtml}>
                  Descargar HTML
                </Button>
              </div>
              <pre className="h-[290px] overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
                <code>{generatedCode}</code>
              </pre>
            </Card>
          </section>
          </div>
        ) : mode === 'layout' ? (
          <div className="grid gap-5 xl:grid-cols-12">
            <section className="space-y-5 xl:col-span-4">
              <Card title="Diseño de layout" description="Configura una estructura completa de página">
                <ControlLabel>Clase de página</ControlLabel>
                <TailwindClassPicker
                  value={layout.pageClasses}
                  onChange={(value) => setLayout((prev) => ({ ...prev, pageClasses: value }))}
                />

                <ControlLabel>Clase de shell (sidebar + content)</ControlLabel>
                <TailwindClassPicker
                  value={layout.shellClasses}
                  onChange={(value) => setLayout((prev) => ({ ...prev, shellClasses: value }))}
                />

                <div className="mt-4 flex items-center gap-2">
                  <input
                    id="showSidebar"
                    type="checkbox"
                    checked={layout.showSidebar}
                    onChange={(event) => setLayout((prev) => ({ ...prev, showSidebar: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <label htmlFor="showSidebar" className="text-sm text-slate-700">
                    Mostrar sidebar
                  </label>
                </div>
              </Card>

              <LayoutSectionEditor
                title="Header"
                classes={layout.headerClasses}
                componentIds={layout.headerComponentIds}
                components={savedComponents}
                heading={layout.headerTitle}
                body=""
                onClassesChange={(value) => setLayout((prev) => ({ ...prev, headerClasses: value }))}
                onAddComponent={(value) =>
                  setLayout((prev) => ({ ...prev, headerComponentIds: [...prev.headerComponentIds, value] }))
                }
                onRemoveComponent={(index) =>
                  setLayout((prev) => ({
                    ...prev,
                    headerComponentIds: prev.headerComponentIds.filter((_, itemIndex) => itemIndex !== index)
                  }))
                }
                onHeadingChange={(value) => setLayout((prev) => ({ ...prev, headerTitle: value }))}
                onBodyChange={() => {}}
                hideBody
              />

              {layout.showSidebar && (
                <LayoutSectionEditor
                  title="Sidebar"
                  classes={layout.sidebarClasses}
                  componentIds={layout.sidebarComponentIds}
                  components={savedComponents}
                  heading={layout.sidebarTitle}
                  body={layout.sidebarBody}
                  onClassesChange={(value) => setLayout((prev) => ({ ...prev, sidebarClasses: value }))}
                  onAddComponent={(value) =>
                    setLayout((prev) => ({ ...prev, sidebarComponentIds: [...prev.sidebarComponentIds, value] }))
                  }
                  onRemoveComponent={(index) =>
                    setLayout((prev) => ({
                      ...prev,
                      sidebarComponentIds: prev.sidebarComponentIds.filter((_, itemIndex) => itemIndex !== index)
                    }))
                  }
                  onHeadingChange={(value) => setLayout((prev) => ({ ...prev, sidebarTitle: value }))}
                  onBodyChange={(value) => setLayout((prev) => ({ ...prev, sidebarBody: value }))}
                />
              )}

              <LayoutSectionEditor
                title="Content"
                classes={layout.contentClasses}
                componentIds={layout.contentComponentIds}
                components={savedComponents}
                heading={layout.contentTitle}
                body={layout.contentBody}
                onClassesChange={(value) => setLayout((prev) => ({ ...prev, contentClasses: value }))}
                onAddComponent={(value) =>
                  setLayout((prev) => ({ ...prev, contentComponentIds: [...prev.contentComponentIds, value] }))
                }
                onRemoveComponent={(index) =>
                  setLayout((prev) => ({
                    ...prev,
                    contentComponentIds: prev.contentComponentIds.filter((_, itemIndex) => itemIndex !== index)
                  }))
                }
                onHeadingChange={(value) => setLayout((prev) => ({ ...prev, contentTitle: value }))}
                onBodyChange={(value) => setLayout((prev) => ({ ...prev, contentBody: value }))}
              />

              <LayoutSectionEditor
                title="Footer"
                classes={layout.footerClasses}
                componentIds={layout.footerComponentIds}
                components={savedComponents}
                heading=""
                body={layout.footerText}
                onClassesChange={(value) => setLayout((prev) => ({ ...prev, footerClasses: value }))}
                onAddComponent={(value) =>
                  setLayout((prev) => ({ ...prev, footerComponentIds: [...prev.footerComponentIds, value] }))
                }
                onRemoveComponent={(index) =>
                  setLayout((prev) => ({
                    ...prev,
                    footerComponentIds: prev.footerComponentIds.filter((_, itemIndex) => itemIndex !== index)
                  }))
                }
                onHeadingChange={() => {}}
                onBodyChange={(value) => setLayout((prev) => ({ ...prev, footerText: value }))}
                hideHeading
              />
            </section>

            <section className="space-y-5 xl:col-span-8">
              <Card title="Vista previa del layout" description="Header + Sidebar + Content + Footer">
                <div className="mb-3 flex items-center gap-2">
                  <SizePill size="desktop" current={layoutPreviewSize} onChange={setLayoutPreviewSize} />
                  <SizePill size="tablet" current={layoutPreviewSize} onChange={setLayoutPreviewSize} />
                  <SizePill size="mobile" current={layoutPreviewSize} onChange={setLayoutPreviewSize} />
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <div
                    className={`mx-auto h-[520px] overflow-auto rounded-md border border-slate-300 bg-white ${layout.pageClasses} ${
                      layoutPreviewSize === 'desktop'
                        ? 'w-full'
                        : layoutPreviewSize === 'tablet'
                          ? 'w-[760px] max-w-full'
                          : 'w-[360px]'
                    }`}
                  >
                    <header className={layout.headerClasses}>
                      <h2 className="text-lg font-semibold">{layout.headerTitle}</h2>
                      {renderSavedComponents(layout.headerComponentIds, savedComponents)}
                    </header>
                    <main className={layout.shellClasses}>
                      {layout.showSidebar && (
                        <aside className={layout.sidebarClasses}>
                          <h3 className="text-sm font-semibold">{layout.sidebarTitle}</h3>
                          <ul className="mt-2 space-y-1 text-sm">
                            {layout.sidebarBody.split('\n').filter(Boolean).map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                          {renderSavedComponents(layout.sidebarComponentIds, savedComponents)}
                        </aside>
                      )}
                      <section className={layout.contentClasses}>
                        <h3 className="text-lg font-semibold">{layout.contentTitle}</h3>
                        <p className="mt-2 text-sm">{layout.contentBody}</p>
                        {renderSavedComponents(layout.contentComponentIds, savedComponents)}
                      </section>
                    </main>
                    <footer className={layout.footerClasses}>
                      {layout.footerText}
                      {renderSavedComponents(layout.footerComponentIds, savedComponents)}
                    </footer>
                  </div>
                </div>
              </Card>

              <Card title="Código generado del layout" description="HTML base para una página completa">
                <div className="mb-3 flex gap-2">
                  <Button onClick={copyLayoutCode}>{layoutCopyState === 'done' ? 'Copiado' : 'Copiar código'}</Button>
                  <Button variant="outline" onClick={downloadLayoutHtml}>
                    Descargar HTML
                  </Button>
                </div>
                <pre className="h-[320px] overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
                  <code>{layoutCode}</code>
                </pre>
              </Card>
            </section>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-12">
            <section className="space-y-5 xl:col-span-4">
              <Card title="Diseño objetivo" description="Selecciona nivel y replica el diseño">
                <ControlLabel>Nivel de evaluación</ControlLabel>
                <Select
                  value={evaluationScenarioId}
                  onChange={(event) => setEvaluationScenarioId(event.target.value)}
                >
                  {evaluationScenarios.map((scenario) => (
                    <option key={scenario.id} value={scenario.id}>
                      {scenario.name} ({scenario.level})
                    </option>
                  ))}
                </Select>
                <p className="mt-2 text-sm text-slate-600">{evaluationScenario.description}</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  {evaluationScenario.targetTree.map((node) => renderPreviewNode(node))}
                </div>
                <Button variant="outline" onClick={resetEvaluation}>
                  Reiniciar ejercicio
                </Button>
              </Card>

              <Card title="Editor del estudiante" description="Usa clases Tailwind para recrear el diseño">
                <ControlLabel>Etiqueta HTML</ControlLabel>
                <Select
                  value={evaluationTagValue}
                  onChange={(event) => {
                    const value = event.target.value as SelectTagValue;
                    if (value === 'text') {
                      updateEvaluationNode({ tag: 'p', content: evaluationNode?.content || 'text' });
                    } else {
                      updateEvaluationNode({ tag: value });
                    }
                  }}
                  disabled={!evaluationNode}
                >
                  {tagOptions.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </Select>

                <ControlLabel>Nivel</ControlLabel>
                <Input readOnly value={evaluationLevel} />

                <ControlLabel>Contenido</ControlLabel>
                <Input
                  value={evaluationNode?.content ?? ''}
                  onChange={(event) => updateEvaluationNode({ content: event.target.value })}
                  disabled={!evaluationNode}
                />

                <ControlLabel>Categoría de clases</ControlLabel>
                <Select
                  value={evaluationClassCategory}
                  onChange={(event) => setEvaluationClassCategory(event.target.value)}
                  disabled={!evaluationNode}
                >
                  {tailwindClassesGrouped.map((group) => (
                    <option key={group.category} value={group.category}>
                      {group.category}
                    </option>
                  ))}
                </Select>

                <ControlLabel>Buscar clase</ControlLabel>
                <Input
                  value={evaluationClassQuery}
                  onChange={(event) => setEvaluationClassQuery(event.target.value)}
                  placeholder="bg-, text-, rounded..."
                  disabled={!evaluationNode}
                />
                <div className="mt-2 max-h-40 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-2">
                  <div className="flex flex-wrap gap-1.5">
                    {evaluationFilteredClasses.map((klass) => (
                      <button
                        key={klass}
                        type="button"
                        onClick={() => addEvaluationClass(klass)}
                        className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                      >
                        {klass}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(evaluationNode?.classes ?? []).map((klass) => (
                    <button
                      key={klass}
                      type="button"
                      onClick={() => removeEvaluationClass(klass)}
                      className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {klass} ×
                    </button>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button onClick={addEvaluationRoot}>Agregar raíz</Button>
                  <Button onClick={addEvaluationChild}>Agregar hijo</Button>
                  <Button variant="outline" onClick={deleteEvaluationNode}>
                    Eliminar nodo
                  </Button>
                </div>
              </Card>

              <Card title="Mapa del ejercicio" description="Selecciona el nodo a editar">
                <div className="space-y-2">
                  {evaluationTree.map((node) => (
                    <MapNode
                      key={node.id}
                      node={node}
                      level={0}
                      selectedId={evaluationSelectedId}
                      onSelect={setEvaluationSelectedId}
                    />
                  ))}
                </div>
              </Card>
            </section>

            <section className="space-y-5 xl:col-span-8">
              <Card title="Vista previa del estudiante" description="Compara con el diseño objetivo">
                <div className="mb-3 flex items-center gap-2">
                  <SizePill size="desktop" current={evaluationPreviewSize} onChange={setEvaluationPreviewSize} />
                  <SizePill size="tablet" current={evaluationPreviewSize} onChange={setEvaluationPreviewSize} />
                  <SizePill size="mobile" current={evaluationPreviewSize} onChange={setEvaluationPreviewSize} />
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <div
                    className={`mx-auto h-[520px] overflow-auto rounded-md border border-slate-300 bg-white p-4 ${
                      evaluationPreviewSize === 'desktop'
                        ? 'w-full'
                        : evaluationPreviewSize === 'tablet'
                          ? 'w-[760px] max-w-full'
                          : 'w-[360px]'
                    }`}
                  >
                    {evaluationTree.map((node) => renderPreviewNode(node))}
                  </div>
                </div>
              </Card>

              <Card title="Evaluación" description="Obtén una puntuación de 0 a 100">
                <div className="mb-3 flex items-center gap-2">
                  <Button onClick={evaluateSubmission}>Evaluar</Button>
                  {evaluationScore !== null && (
                    <span className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1 text-sm font-semibold">
                      Puntaje: {evaluationScore}/100
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {evaluationChecks.map((check) => (
                    <li
                      key={check.label}
                      className={`rounded-md border px-3 py-2 text-sm ${
                        check.passed ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'
                      }`}
                    >
                      {check.passed ? 'OK' : 'PENDIENTE'} ({check.weight} pts) - {check.label}
                    </li>
                  ))}
                </ul>
                <pre className="mt-3 h-[220px] overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
                  <code>{evaluationCode}</code>
                </pre>
              </Card>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function LayoutSectionEditor(props: {
  title: string;
  classes: string;
  componentIds: string[];
  components: SavedComponent[];
  heading: string;
  body: string;
  onClassesChange: (value: string) => void;
  onAddComponent: (value: string) => void;
  onRemoveComponent: (index: number) => void;
  onHeadingChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  hideBody?: boolean;
  hideHeading?: boolean;
}) {
  const [selectedComponentToAdd, setSelectedComponentToAdd] = useState('');

  return (
    <Card title={props.title}>
      <ControlLabel>Clases</ControlLabel>
      <TailwindClassPicker value={props.classes} onChange={props.onClassesChange} />

      <ControlLabel>Componente insertado</ControlLabel>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Select value={selectedComponentToAdd} onChange={(event) => setSelectedComponentToAdd(event.target.value)}>
          <option value="">Selecciona componente...</option>
          {props.components.map((component) => (
            <option key={component.id} value={component.id}>
              {component.name}
            </option>
          ))}
        </Select>
        <Button
          variant="outline"
          onClick={() => {
            if (!selectedComponentToAdd) return;
            props.onAddComponent(selectedComponentToAdd);
            setSelectedComponentToAdd('');
          }}
        >
          Agregar
        </Button>
      </div>
      <div className="mt-2 space-y-1">
        {props.componentIds.length === 0 && <p className="text-xs text-slate-500">Sin componentes insertados.</p>}
        {props.componentIds.map((componentId, index) => {
          const component = props.components.find((item) => item.id === componentId);
          return (
            <div key={`${componentId}-${index}`} className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-2 py-1">
              <span className="text-xs text-slate-700">{component?.name ?? 'Componente eliminado'}</span>
              <button
                type="button"
                onClick={() => props.onRemoveComponent(index)}
                className="text-xs text-rose-700 hover:underline"
              >
                quitar
              </button>
            </div>
          );
        })}
      </div>
      {!props.hideHeading && (
        <>
          <ControlLabel>Título</ControlLabel>
          <Input value={props.heading} onChange={(event) => props.onHeadingChange(event.target.value)} />
        </>
      )}
      {!props.hideBody && (
        <>
          <ControlLabel>Contenido</ControlLabel>
          <textarea
            value={props.body}
            onChange={(event) => props.onBodyChange(event.target.value)}
            className="h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-slate-400"
          />
        </>
      )}
    </Card>
  );
}

function Card(props: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight">{props.title}</h2>
      {props.description && <p className="mt-1 text-sm text-slate-600">{props.description}</p>}
      <div className="mt-4">{props.children}</div>
    </div>
  );
}

function ControlLabel(props: { children: ReactNode }) {
  return <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{props.children}</p>;
}

function Button(props: {
  children: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline';
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition ${
        props.variant === 'outline'
          ? 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100'
          : 'bg-slate-900 text-white hover:bg-slate-700'
      }`}
    >
      {props.children}
    </button>
  );
}

function Input(props: InputHTMLAttributes<HTMLInputElement> & { readOnly?: boolean }) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-offset-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-400 ${props.className ?? ''}`}
    />
  );
}

function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 ${props.className ?? ''}`}
    />
  );
}

function MapNode(props: {
  node: BuilderNode;
  level: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = props.node.id === props.selectedId;

  return (
    <div style={{ marginLeft: `${props.level * 14}px` }}>
      <div
        onClick={() => props.onSelect(props.node.id)}
        className={`rounded-md border px-3 py-2 transition ${
          selected ? 'border-slate-900 bg-slate-100' : 'border-slate-200 bg-white hover:bg-slate-50'
        }`}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            props.onSelect(props.node.id);
          }}
          className="w-full text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900">{displayTag(props.node)}</span>
            <span className="text-xs text-slate-500">Nivel {props.level}</span>
          </div>
        </button>
        <div className="mt-2 flex flex-wrap gap-1">
          {props.node.classes.map((klass) => (
            <span key={klass} className="rounded border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 text-[11px] text-emerald-700">
              {klass}
            </span>
          ))}
          {props.node.classes.length === 0 && <span className="text-xs text-slate-400">Sin clases</span>}
        </div>
      </div>
      {props.node.children.map((child) => (
        <MapNode
          key={child.id}
          node={child}
          level={props.level + 1}
          selectedId={props.selectedId}
          onSelect={props.onSelect}
        />
      ))}
    </div>
  );
}

function SizePill(props: {
  size: PreviewSize;
  current: PreviewSize;
  onChange: (size: PreviewSize) => void;
}) {
  const active = props.current === props.size;
  const labels: Record<PreviewSize, string> = {
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile'
  };

  return (
    <button
      type="button"
      onClick={() => props.onChange(props.size)}
      className={`inline-flex h-8 items-center rounded-md border px-2.5 text-xs font-medium transition ${
        active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
      }`}
    >
      {labels[props.size]}
    </button>
  );
}

function serializeLayout(layout: LayoutConfig, savedComponents: SavedComponent[]): string {
  const headerComponentHtml = findSavedComponentsHtml(layout.headerComponentIds, savedComponents);
  const sidebarComponentHtml = findSavedComponentsHtml(layout.sidebarComponentIds, savedComponents);
  const contentComponentHtml = findSavedComponentsHtml(layout.contentComponentIds, savedComponents);
  const footerComponentHtml = findSavedComponentsHtml(layout.footerComponentIds, savedComponents);

  const sidebarHtml = layout.showSidebar
    ? `
      <aside class="${layout.sidebarClasses}">
        <h3 class="text-sm font-semibold">${escapeHtml(layout.sidebarTitle)}</h3>
        <ul class="mt-2 space-y-1 text-sm">
          ${layout.sidebarBody
            .split('\n')
            .filter(Boolean)
            .map((line) => `<li>${escapeHtml(line)}</li>`)
            .join('')}
        </ul>
        ${sidebarComponentHtml}
      </aside>`
    : '';

  return `<div class="${layout.pageClasses}">
  <header class="${layout.headerClasses}">
    <h2 class="text-lg font-semibold">${escapeHtml(layout.headerTitle)}</h2>
    ${headerComponentHtml}
  </header>
  <main class="${layout.shellClasses}">
    ${sidebarHtml}
    <section class="${layout.contentClasses}">
      <h3 class="text-lg font-semibold">${escapeHtml(layout.contentTitle)}</h3>
      <p class="mt-2 text-sm">${escapeHtml(layout.contentBody)}</p>
      ${contentComponentHtml}
    </section>
  </main>
  <footer class="${layout.footerClasses}">
    ${escapeHtml(layout.footerText)}
    ${footerComponentHtml}
  </footer>
</div>`;
}

function renderPreviewNode(node: BuilderNode): ReactElement {
  const className = node.classes.join(' ');
  const children = node.children.map((child) => renderPreviewNode(child));
  const key = node.id;

  if (node.tag === 'img') {
    const alt = node.content || 'Imagen';
    return createElement('img', {
      key,
      className,
      alt,
      src: `https://placehold.co/600x360/e2e8f0/334155?text=${encodeURIComponent(alt)}`
    });
  }

  if (node.tag === 'input') {
    return createElement('input', {
      key,
      className,
      type: 'text',
      placeholder: node.content
    });
  }

  if (node.tag === 'textarea') {
    return createElement('textarea', {
      key,
      className,
      placeholder: node.content,
      defaultValue: ''
    });
  }

  if (node.tag === 'a') {
    return createElement('a', { key, className, href: '#' }, node.content, ...children);
  }

  return createElement(node.tag, { key, className }, node.content, ...children);
}

function runEvaluationChecks(tree: BuilderNode[], scenarioId: string): EvaluationCheck[] {
  const nodes = walkTree(tree);
  const hasNode = (matcher: (node: BuilderNode) => boolean) => nodes.some(matcher);

  if (scenarioId === 'level-2-hero') {
    return [
      {
        label: 'Contenedor hero oscuro con padding y bordes redondeados',
        weight: 25,
        passed: hasNode((node) => includesAll(node.classes, ['bg-slate-900', 'p-6', 'rounded-xl']))
      },
      {
        label: 'Título centrado con texto blanco',
        weight: 20,
        passed: hasNode((node) => node.tag.startsWith('h') && includesAll(node.classes, ['text-center', 'text-white']))
      },
      {
        label: 'Texto descriptivo con margen superior',
        weight: 20,
        passed: hasNode((node) => node.tag === 'p' && node.classes.includes('mt-2') && node.classes.includes('text-sm'))
      },
      {
        label: 'Botón CTA con fondo azul',
        weight: 25,
        passed: hasNode((node) => node.tag === 'button' && includesAll(node.classes, ['bg-blue-600', 'text-white']))
      },
      { label: 'Ancho controlado con max-w-sm y centrado', weight: 10, passed: hasNode((node) => includesAll(node.classes, ['max-w-sm', 'mx-auto'])) }
    ];
  }

  if (scenarioId === 'level-3-toolbar') {
    return [
      { label: 'Barra principal en flex con distribución horizontal', weight: 25, passed: hasNode((node) => includesAll(node.classes, ['flex', 'justify-between', 'items-center'])) },
      { label: 'Contenedor con borde y sombra', weight: 20, passed: hasNode((node) => includesAll(node.classes, ['border', 'shadow-sm'])) },
      { label: 'Grupo de acciones con gap', weight: 20, passed: hasNode((node) => includesAll(node.classes, ['flex', 'gap-2'])) },
      { label: 'Botón principal con fondo azul', weight: 20, passed: hasNode((node) => node.tag === 'button' && node.classes.includes('bg-blue-600')) },
      { label: 'Texto de cabecera visible', weight: 15, passed: hasNode((node) => node.content.toLowerCase().includes('panel')) }
    ];
  }

  if (scenarioId === 'level-4-profile') {
    return [
      { label: 'Card de perfil con shadow-md y borde', weight: 25, passed: hasNode((node) => includesAll(node.classes, ['shadow-md', 'border', 'rounded-xl'])) },
      { label: 'Nombre con estilo de título', weight: 20, passed: hasNode((node) => node.content.toLowerCase().includes('maría') || includesAll(node.classes, ['text-lg', 'font-semibold'])) },
      { label: 'Rol o subtítulo con estilo secundario', weight: 15, passed: hasNode((node) => node.tag === 'p' && includesAll(node.classes, ['text-sm', 'text-slate-700'])) },
      { label: 'Zona de acciones en flex', weight: 20, passed: hasNode((node) => includesAll(node.classes, ['flex', 'gap-2'])) },
      { label: 'Al menos un botón primario azul', weight: 20, passed: hasNode((node) => node.tag === 'button' && node.classes.includes('bg-blue-600')) }
    ];
  }

  if (scenarioId === 'level-5-mini-dashboard') {
    return [
      { label: 'Contenedor principal tipo dashboard', weight: 20, passed: hasNode((node) => includesAll(node.classes, ['max-w-sm', 'rounded-xl', 'p-6'])) },
      { label: 'Header interno con flex y botón', weight: 20, passed: hasNode((node) => includesAll(node.classes, ['flex', 'justify-between', 'items-center'])) },
      { label: 'Botón actualizar con hover', weight: 20, passed: hasNode((node) => node.tag === 'button' && includesAll(node.classes, ['bg-blue-600', 'hover:bg-blue-700'])) },
      { label: 'Bloque de métricas con dos tarjetas', weight: 20, passed: nodes.filter((node) => node.classes.includes('bg-slate-50') && node.classes.includes('p-3')).length >= 2 },
      { label: 'Uso de tipografía de énfasis en métricas o título', weight: 20, passed: hasNode((node) => node.classes.includes('font-semibold') || node.classes.includes('font-medium')) }
    ];
  }

  const card = nodes.find(
    (node) =>
      (node.tag === 'div' || node.tag === 'article') &&
      includesAll(node.classes, ['rounded-xl', 'border', 'bg-white', 'p-6']) &&
      node.classes.some((klass) => klass === 'max-w-sm' || klass === 'shadow-sm')
  );
  const title = nodes.find(
    (node) =>
      (node.tag === 'h3' || node.tag === 'h2') &&
      includesAll(node.classes, ['text-lg', 'font-semibold']) &&
      node.content.toLowerCase().includes('tarjeta')
  );
  const text = nodes.find(
    (node) =>
      node.tag === 'p' &&
      node.content.toLowerCase().includes('tailwind') &&
      includesAll(node.classes, ['mt-2', 'text-sm'])
  );
  const button = nodes.find(
    (node) =>
      node.tag === 'button' &&
      node.content.toLowerCase().includes('comenzar') &&
      includesAll(node.classes, ['bg-blue-600', 'text-white', 'rounded-lg'])
  );
  const hoverState = nodes.some((node) => node.classes.includes('hover:bg-blue-700'));

  return [
    { label: 'Contenedor card con borde, sombra y espaciado', weight: 25, passed: Boolean(card) },
    { label: 'Título correcto con tipografía requerida', weight: 20, passed: Boolean(title) },
    { label: 'Texto descriptivo con estilo correcto', weight: 20, passed: Boolean(text) },
    { label: 'Botón principal con clases base', weight: 25, passed: Boolean(button) },
    { label: 'Estado hover en botón', weight: 10, passed: hoverState }
  ];
}

function includesAll(source: string[], expected: string[]): boolean {
  return expected.every((item) => source.includes(item));
}

function displayTag(node: BuilderNode): string {
  if (node.tag === 'p' && node.content.trim().toLowerCase() === 'text') return 'text';
  if (node.tag === 'div') return 'Div';
  return node.tag;
}

function clone(tree: BuilderNode[]): BuilderNode[] {
  return structuredClone(tree);
}

function cloneTreeWithPrefix(tree: BuilderNode[], prefix: string): BuilderNode[] {
  const cloned = structuredClone(tree) as BuilderNode[];
  return cloned.map((node, index) => addPrefixToNode(node, `${prefix}-${index}`));
}

function addPrefixToNode(node: BuilderNode, prefix: string): BuilderNode {
  return {
    ...node,
    id: `${prefix}-${node.id}`,
    children: node.children.map((child, index) => addPrefixToNode(child, `${prefix}-${index}`))
  };
}

function findLevel(tree: BuilderNode[], targetId: string, level = 0): number {
  for (const node of tree) {
    if (node.id === targetId) return level;
    const nested = findLevel(node.children, targetId, level + 1);
    if (nested !== -1) return nested;
  }
  return 0;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function TailwindClassPicker(props: {
  value: string;
  onChange: (nextValue: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(tailwindClassesGrouped[0]?.category ?? '');
  const activeClasses = useMemo(
    () => props.value.split(/\s+/).map((item) => item.trim()).filter(Boolean),
    [props.value]
  );
  const filteredClasses = useMemo(() => {
    const group = tailwindClassesGrouped.find((item) => item.category === category);
    if (!group) return [];
    const q = query.trim().toLowerCase();
    if (!q) return group.classes;
    return group.classes.filter((klass) => klass.toLowerCase().includes(q));
  }, [category, query]);

  const addClass = (klass: string) => {
    if (activeClasses.includes(klass)) return;
    props.onChange([...activeClasses, klass].join(' '));
  };

  const removeClass = (klass: string) => {
    props.onChange(activeClasses.filter((item) => item !== klass).join(' '));
  };

  return (
    <div className="space-y-2">
      <Select value={category} onChange={(event) => setCategory(event.target.value)}>
        {tailwindClassesGrouped.map((group) => (
          <option key={group.category} value={group.category}>
            {group.category}
          </option>
        ))}
      </Select>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar clase... ej: bg-, text-, rounded"
      />
      <div className="max-h-40 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-2">
        {filteredClasses.length === 0 && <p className="text-xs text-slate-500">Sin resultados.</p>}
        <div className="flex flex-wrap gap-1.5">
          {filteredClasses.map((klass) => (
            <button
              key={klass}
              type="button"
              onClick={() => addClass(klass)}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-100"
            >
              {klass}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeClasses.length === 0 && <span className="text-xs text-slate-500">Sin clases seleccionadas.</span>}
        {activeClasses.map((klass) => (
          <button
            key={klass}
            type="button"
            onClick={() => removeClass(klass)}
            className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
          >
            {klass} ×
          </button>
        ))}
      </div>
    </div>
  );
}

function renderSavedComponents(componentIds: string[], components: SavedComponent[]): ReactNode {
  if (componentIds.length === 0) return null;
  return (
    <div className="mt-3 space-y-2">
      {componentIds.map((componentId, index) => {
        const component = components.find((item) => item.id === componentId);
        if (!component) return null;
        return (
          <div key={`${componentId}-${index}`} className="space-y-2">
            {component.tree.map((node) => renderPreviewNode(node))}
          </div>
        );
      })}
    </div>
  );
}

function findSavedComponentsHtml(componentIds: string[], components: SavedComponent[]): string {
  if (componentIds.length === 0) return '';
  return componentIds
    .map((componentId) => {
      const component = components.find((item) => item.id === componentId);
      if (!component) return '';
      return serializeHtml(component.tree);
    })
    .join('\n');
}
