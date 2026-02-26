import React, { useState, useRef, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

// Main App component for the Tailwind CSS Component Builder
const App = () => {
// Estados de la aplicación
const [selectedElement, setSelectedElement] = useState(null);
const [componentTree, setComponentTree] = useState([]);
const [previewHtml, setPreviewHtml] = useState('');
const [generatedCode, setGeneratedCode] = useState('');
const [savedComponents, setSavedComponents] = useState([]); // Estado para los componentes guardados
const [selectedSavedComponentId, setSelectedSavedComponentId] = useState(''); // ID del componente guardado seleccionado
const [loading, setLoading] = useState(true); // Estado de carga inicial de Firebase

// Refs de Firebase
const [db, setDb] = useState(null);
const [auth, setAuth] = useState(null);
const [userId, setUserId] = useState(null);

// Ref para el iframe de previsualización
const iframeRef = useRef(null);

// Inicialización de Firebase
useEffect(() => {
const appId = typeof **app_id !== 'undefined' ? **app_id : 'default-app-id';
const firebaseConfig = typeof **firebase_config !== 'undefined' ? JSON.parse(**firebase_config) : {};

    try {
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);
      setDb(firestoreDb);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
          setLoading(false);
        } else {
          // If no user, try to sign in anonymously
          try {
            if (typeof __initial_auth_token !== 'undefined') {
              await signInWithCustomToken(firebaseAuth, __initial_auth_token);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          } catch (error) {
            console.error("Error signing in with custom token or anonymously:", error);
            setLoading(false);
          }
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      setLoading(false);
    }

}, []);

// Escuchar cambios en los componentes guardados en Firestore
useEffect(() => {
if (db && userId) {
const componentsCollectionRef = collection(db, `artifacts/${userId}/users/${userId}/components`);
const unsubscribe = onSnapshot(componentsCollectionRef, (snapshot) => {
const componentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
setSavedComponents(componentsData);
}, (error) => {
console.error("Error fetching saved components:", error);
});
return () => unsubscribe();
}
}, [db, userId]);

// Lista de etiquetas HTML disponibles para el dropdown
const htmlTags = [
'div', 'p', 'span', 'h1', 'h2', 'h3', 'a', 'button', 'img', 'input',
'textarea', 'ul', 'li', 'section', 'header', 'footer', 'nav'
];

// Lista agrupada de clases Tailwind CSS comunes para el dropdown
const tailwindClassesGrouped = [
{ category: 'Tipografía', classes: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black', 'text-left', 'text-center', 'text-right', 'text-justify', 'text-gray-900', 'text-blue-500', 'text-green-500', 'text-red-500', 'text-white'] },
{ category: 'Fondos', classes: ['bg-white', 'bg-gray-100', 'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-400', 'bg-opacity-50', 'bg-opacity-75', 'bg-opacity-100'] },
{ category: 'Espaciado (Padding & Margin)', classes: ['p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'pt-1', 'pb-1', 'pl-1', 'pr-1', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'mx-auto', 'my-auto', 'mt-auto', 'mb-auto', 'ml-auto', 'mr-auto'] },
{ category: 'Flexbox', classes: ['flex', 'inline-flex', 'flex-row', 'flex-col', 'flex-wrap', 'flex-nowrap', 'justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly', 'items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch', 'self-auto', 'self-start', 'self-end', 'self-center', 'self-stretch', 'gap-1', 'gap-2', 'gap-3', 'gap-4'] },
{ category: 'Grid', classes: ['grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'gap-x-4', 'gap-y-4'] },
{ category: 'Dimensiones (Ancho y Alto)', classes: ['w-full', 'w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-3/4', 'w-screen', 'min-w-full', 'max-w-full', 'h-auto', 'h-full', 'h-1/2', 'h-screen', 'min-h-full', 'max-h-full'] },
{ category: 'Bordes y Esquinas', classes: ['border', 'border-2', 'border-4', 'border-8', 'border-0', 'border-gray-300', 'border-blue-500', 'rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-full'] },
{ category: 'Sombras', classes: ['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner', 'shadow-none'] },
{ category: 'Diseño y Posicionamiento', classes: ['block', 'inline', 'inline-block', 'hidden', 'relative', 'absolute', 'fixed', 'sticky', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50'] },
{ category: 'Interactividad', classes: ['cursor-pointer', 'pointer-events-none', 'opacity-0', 'opacity-25', 'opacity-50', 'opacity-75', 'opacity-100'] },
];

// Mapa de colores para las clases por categoría
const classColorsMap = {
'Tipografía': 'bg-purple-100 text-purple-800',
'Fondos': 'bg-yellow-100 text-yellow-800',
'Espaciado (Padding & Margin)': 'bg-blue-100 text-blue-800',
'Flexbox': 'bg-pink-100 text-pink-800',
'Grid': 'bg-indigo-100 text-indigo-800',
'Dimensiones (Ancho y Alto)': 'bg-green-100 text-green-800',
'Bordes y Esquinas': 'bg-red-100 text-red-800',
'Sombras': 'bg-gray-200 text-gray-800',
'Diseño y Posicionamiento': 'bg-teal-100 text-teal-800',
'Interactividad': 'bg-orange-100 text-orange-800',
'Default': 'bg-gray-300 text-gray-800', // Color de respaldo
};

// Función para obtener las clases de color de Tailwind para una clase dada
const getTailwindClassColors = (className) => {
for (const group of tailwindClassesGrouped) {
if (group.classes.includes(className)) {
return classColorsMap[group.category] || classColorsMap['Default'];
}
}
return classColorsMap['Default'];
};

// Función para generar un ID único para nuevos elementos
const generateUniqueId = () => `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Función para añadir un nuevo elemento raíz
const addRootElement = () => {
const newElement = {
id: generateUniqueId(),
tag: 'div', // Etiqueta por defecto
content: 'Nuevo Elemento', // Contenido por defecto
classes: [],
level: 0,
children: []
};
setComponentTree(prev => [...prev, newElement]);
setSelectedElement(newElement.id); // Seleccionar el nuevo elemento para edición
};

// Función para añadir un elemento hijo a un parentId específico
const addChildElement = (parentId) => {
const newChild = {
id: generateUniqueId(),
tag: 'span', // Etiqueta por defecto para hijos
content: 'Contenido', // Contenido por defecto para hijos
classes: [],
level: 0, // Esto se actualizará recursivamente por updateTreeWithChild
children: []
};

    const updateTreeWithChild = (elements, targetParentId, newChildToAdd, currentLevel) => {
      return elements.map(element => {
        if (element.id === targetParentId) {
          return {
            ...element,
            children: [...element.children, { ...newChildToAdd, level: currentLevel + 1 }]
          };
        } else if (element.children && element.children.length > 0) {
          return {
            ...element,
            children: updateTreeWithChild(element.children, targetParentId, newChildToAdd, currentLevel + 1)
          };
        }
        return element;
      });
    };

    setComponentTree(prev => updateTreeWithChild(prev, parentId, newChild, 0));
    setSelectedElement(newChild.id); // Seleccionar el hijo recién añadido para edición

};

// Función para actualizar propiedades de un elemento (tag, content)
const updateElementProperty = (id, property, value) => {
if (!id) return;

    const updateRecursive = (elements) => {
      return elements.map(el => {
        if (el.id === id) {
          return { ...el, [property]: value };
        } else if (el.children && el.children.length > 0) {
          return { ...el, children: updateRecursive(el.children) };
        }
        return el;
      });
    };
    setComponentTree(prev => updateRecursive(prev));

};

// Función para añadir una clase de Tailwind a un elemento
const addClassToElement = (id, newClass) => {
if (!id) return;

    const updateRecursive = (elements) => {
      return elements.map(el => {
        if (el.id === id) {
          if (!el.classes.includes(newClass)) {
            return { ...el, classes: [...el.classes, newClass] };
          }
        } else if (el.children && el.children.length > 0) {
          return { ...el, children: updateRecursive(el.children) };
        }
        return el;
      });
    };
    setComponentTree(prev => updateRecursive(prev));

};

// Función para eliminar una clase de Tailwind de un elemento
const removeClassFromElement = (id, classToRemove) => {
const updateRecursive = (elements) => {
return elements.map(el => {
if (el.id === id) {
return { ...el, classes: el.classes.filter(c => c !== classToRemove) };
} else if (el.children && el.children.length > 0) {
return { ...el, children: updateRecursive(el.children) };
}
return el;
});
};
setComponentTree(prev => updateRecursive(prev));
};

// Función para eliminar un elemento del árbol
const removeElement = (idToRemove) => {
const removeRecursive = (elements) => {
return elements.filter(el => el.id !== idToRemove)
.map(el => {
if (el.children && el.children.length > 0) {
return { ...el, children: removeRecursive(el.children) };
}
return el;
});
};
setComponentTree(prev => removeRecursive(prev));
if (selectedElement === idToRemove) {
setSelectedElement(null); // Deseleccionar si el elemento eliminado estaba seleccionado
}
};

// Función auxiliar para encontrar un elemento por su ID en el árbol de componentes
const findElementById = useCallback((elements, id) => {
for (const el of elements) {
if (el.id === id) {
return el;
}
if (el.children && el.children.length > 0) {
const found = findElementById(el.children, id);
if (found) return found;
}
}
return null;
}, []);

// Efecto para actualizar los detalles del elemento seleccionado en los campos de entrada
useEffect(() => {
if (selectedElement) {
const elementDetails = findElementById(componentTree, selectedElement);
// Aquí podrías establecer estados locales para los campos de entrada si fueran separados
}
}, [selectedElement, componentTree, findElementById]);

// Función para generar la cadena HTML recursivamente desde el árbol de componentes
const generateHtml = useCallback((elements, level = 0) => {
return elements.map(element => {
const classes = element.classes.join(' ');
const content = element.content || '';
const childrenHtml = element.children && element.children.length > 0
? generateHtml(element.children, level + 1)
: '';

      if (element.tag === 'img') {
        return `<img class="${classes}" src="https://placehold.co/150x150/lightblue/blue?text=${encodeURIComponent(content || 'Imagen')}" alt="${content}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/cccccc/gray?text=Error';" />`;
      } else if (element.tag === 'input') {
        return `<input type="text" class="${classes}" placeholder="${content}" />`;
      } else if (element.tag === 'textarea') {
        return `<textarea class="${classes}" placeholder="${content}"></textarea>`;
      } else if (element.tag === 'button') {
        return `<button class="${classes}">${content}</button>`;
      } else if (element.tag === 'a') {
        return `<a href="#" class="${classes}">${content}</a>`;
      }

      return `<${element.tag} class="${classes}">${content}${childrenHtml}</${element.tag}>`;
    }).join('\n');

}, []);

// Efecto para actualizar el HTML generado y la previsualización cuando el árbol de componentes cambia
useEffect(() => {
const htmlOutput = generateHtml(componentTree);
setGeneratedCode(htmlOutput);

    const fullHtmlForPreview = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Previsualización del Componente</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
              body {
                  margin: 0;
                  padding: 1rem;
                  font-family: 'Inter', sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: calc(100vh - 2rem);
                  background-color: #f3f4f6;
                  overflow: auto;
              }
              .w-full { width: 100%; }
              * {
                box-sizing: border-box;
              }
              div, p, span, h1, h2, h3, a, button, img, input, textarea, ul, li, section, header, footer, nav {
                  outline: 1px dashed rgba(0,0,0,0.1);
                  outline-offset: -1px;
              }
          </style>
      </head>
      <body>
          ${htmlOutput}
      </body>
      </html>
    `;
    setPreviewHtml(fullHtmlForPreview);

    if (iframeRef.current) {
      iframeRef.current.contentWindow.document.open();
      iframeRef.current.contentWindow.document.write(fullHtmlForPreview);
      iframeRef.current.contentWindow.document.close();
    }

}, [componentTree, generateHtml]);

// Manejador para descargar el código generado
const handleDownload = () => {
const element = document.createElement("a");
const file = new Blob([generatedCode], { type: 'text/html' });
element.href = URL.createObjectURL(file);
element.download = "componente.html";
document.body.appendChild(element);
element.click();
document.body.removeChild(element);
};

// Ejemplos de componentes pre-elaborados
const predefinedComponents = [
{
name: 'Tarjeta Básica',
tree: [
{
id: 'card-1', tag: 'div', content: '', classes: ['bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'max-w-sm', 'mx-auto', 'flex', 'flex-col', 'gap-4'], level: 0, children: [
{ id: 'card-title-1', tag: 'h2', content: 'Título de la Tarjeta', classes: ['text-xl', 'font-bold', 'text-gray-900'], level: 1, children: [] },
{ id: 'card-text-1', tag: 'p', content: 'Este es el contenido de la tarjeta. Puedes añadir más texto o elementos.', classes: ['text-gray-700'], level: 1, children: [] },
{ id: 'card-button-1', tag: 'button', content: 'Más Información', classes: ['bg-blue-500', 'hover:bg-blue-600', 'text-white', 'py-2', 'px-4', 'rounded-md', 'self-end'], level: 1, children: [] },
]
},
]
},
{
name: 'Botón Simple',
tree: [
{ id: 'button-simple', tag: 'button', content: 'Haz Clic', classes: ['bg-green-500', 'hover:bg-green-600', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded'], level: 0, children: [] },
]
},
{
name: 'Barra de Navegación Simple',
tree: [
{
id: 'nav-bar-1', tag: 'nav', content: '', classes: ['bg-gray-800', 'p-4', 'flex', 'justify-between', 'items-center'], level: 0, children: [
{ id: 'nav-logo-1', tag: 'div', content: 'Logo App', classes: ['text-white', 'font-bold', 'text-lg'], level: 1, children: [] },
{
id: 'nav-ul-1', tag: 'ul', content: '', classes: ['flex', 'space-x-4'], level: 1, children: [
{ id: 'nav-li-1', tag: 'li', content: '', classes: [], level: 2, children: [{ id: 'nav-link-1', tag: 'a', content: 'Inicio', classes: ['text-gray-300', 'hover:text-white'], level: 3, children: [] }] },
{ id: 'nav-li-2', tag: 'li', content: '', classes: [], level: 2, children: [{ id: 'nav-link-2', tag: 'a', content: 'Servicios', classes: ['text-gray-300', 'hover:text-white'], level: 3, children: [] }] },
{ id: 'nav-li-3', tag: 'li', content: '', classes: [], level: 2, children: [{ id: 'nav-link-3', tag: 'a', content: 'Contacto', classes: ['text-gray-300', 'hover:text-white'], level: 3, children: [] }] },
]
},
]
}
]
},
];

// Función para cargar un ejemplo pre-elaborado
const loadPredefinedExample = (exampleTree) => {
setComponentTree(exampleTree);
setSelectedElement(exampleTree[0]?.id || null); // Seleccionar el primer elemento del ejemplo
};

// Función para guardar el componente actual en Firestore
const saveComponent = async () => {
if (!db || !userId) {
console.error("Firebase not initialized or user not authenticated.");
return;
}
const componentName = prompt("Introduce un nombre para el componente:");
if (componentName) {
try {
const componentsCollectionRef = collection(db, `artifacts/${userId}/users/${userId}/components`);
await addDoc(componentsCollectionRef, {
name: componentName,
tree: JSON.stringify(componentTree), // Guardar el árbol como JSON string
createdAt: new Date(),
});
alert("Componente guardado exitosamente!");
} catch (e) {
console.error("Error al guardar el componente: ", e);
alert("Error al guardar el componente.");
}
}
};

// Función para cargar un componente guardado
const loadSavedComponent = () => {
const componentToLoad = savedComponents.find(comp => comp.id === selectedSavedComponentId);
if (componentToLoad) {
try {
setComponentTree(JSON.parse(componentToLoad.tree)); // Parsear de nuevo a objeto
setSelectedElement(JSON.parse(componentToLoad.tree)[0]?.id || null);
} catch (e) {
console.error("Error al cargar el componente guardado:", e);
alert("Error al cargar el componente guardado.");
}
} else {
alert("Selecciona un componente para cargar.");
}
};

// Función para eliminar un componente guardado
const deleteSavedComponent = async (idToDelete) => {
if (!db || !userId) {
console.error("Firebase not initialized or user not authenticated.");
return;
}
if (confirm("¿Estás seguro de que quieres eliminar este componente?")) {
try {
await deleteDoc(doc(db, `artifacts/${userId}/users/${userId}/components`, idToDelete));
alert("Componente eliminado exitosamente.");
if (selectedSavedComponentId === idToDelete) {
setSelectedSavedComponentId(''); // Deseleccionar si el eliminado era el seleccionado
}
} catch (e) {
console.error("Error al eliminar el componente: ", e);
alert("Error al eliminar el componente.");
}
}
};

const currentSelectedElementDetails = findElementById(componentTree, selectedElement);

// Helper component to render the recursive component tree in the "Mapa" section
const ComponentMapNode = ({ element, level, onSelect, onAddChild, onRemoveElement, selectedId }) => {
const isSelected = element.id === selectedId;
return (
<div
onClick={(e) => { e.stopPropagation(); onSelect(element.id); }}
className={`flex flex-col rounded-lg p-2 my-1 cursor-pointer transition duration-200 ease-in-out
          ${isSelected ? 'bg-blue-200 border-blue-500 border-2 shadow-md' : 'bg-gray-100 border-gray-300 border'}
          hover:bg-blue-100`}
style={{ marginLeft: `${level * 20}px` }} >
<div className="flex items-center justify-between text-sm font-semibold text-gray-800">
<span>{element.tag.toUpperCase()}</span>
<div className="flex space-x-1">
<button
onClick={(e) => { e.stopPropagation(); onAddChild(element.id); }}
className="text-gray-600 hover:text-blue-600 focus:outline-none"
title="Añadir hijo a este elemento" >
<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
<path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
</svg>
</button>
<button
onClick={(e) => { e.stopPropagation(); onRemoveElement(element.id); }}
className="text-gray-600 hover:text-red-600 focus:outline-none"
title="Eliminar elemento" >
<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
<path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
</svg>
</button>
</div>
</div>
<div className="flex flex-wrap gap-1 mt-1">
{element.classes.map(cls => (
<span key={cls} className={`${getTailwindClassColors(cls)} text-xs font-medium px-2 py-1 rounded-full flex items-center`}>
{cls}
<button
onClick={(e) => { e.stopPropagation(); removeClassFromElement(element.id, cls); }}
className={`ml-1 ${getTailwindClassColors(cls).includes('text-') ? getTailwindClassColors(cls).replace('text-', 'hover:text-') : 'text-current'} focus:outline-none`}
title="Eliminar clase" >
<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
</svg>
</button>
</span>
))}
</div>
{element.children.map(child => (
<ComponentMapNode
key={child.id}
element={child}
level={level + 1}
onSelect={onSelect}
onAddChild={onAddChild}
onRemoveElement={onRemoveElement}
selectedId={selectedId}
/>
))}
</div>
);
};

if (loading) {
return (
<div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl text-gray-700">
Cargando aplicación...
</div>
);
}

return (
<div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col p-4 md:p-8">
{/_ Título de la página _/}
<h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8 mt-4">
Crea tu Sistema de Diseño con Tailwind CSS
</h1>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto">
        {/* Panel Izquierdo: Creación de Componentes, Ejemplos y Catálogo */}
        <div className="flex flex-col w-full lg:w-1/2 p-6 bg-white shadow-xl rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Crea tu componente</h2>

          {/* Controles para el elemento seleccionado actual */}
          <div className="space-y-4 mb-6">
            {/* Selector de Elemento */}
            <div className="flex flex-col">
              <label htmlFor="htmlTag" className="block text-sm font-medium text-gray-700 mb-1">
                Selecciona la etiqueta HTML:
              </label>
              <select
                id="htmlTag"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                value={currentSelectedElementDetails?.tag || 'div'}
                onChange={(e) => updateElementProperty(selectedElement, 'tag', e.target.value)}
                disabled={!selectedElement}
              >
                {htmlTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Input de Contenido para elementos basados en texto */}
            {currentSelectedElementDetails && !['img', 'input', 'textarea'].includes(currentSelectedElementDetails.tag) && (
              <div className="flex flex-col">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Contenido (texto o alt para imagen):
                </label>
                <input
                  type="text"
                  id="content"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                  value={currentSelectedElementDetails?.content || ''}
                  onChange={(e) => updateElementProperty(selectedElement, 'content', e.target.value)}
                  disabled={!selectedElement}
                  placeholder="Ej: Hola Mundo"
                />
              </div>
            )}
            {/* Placeholder/Valor para etiquetas input y textarea */}
            {currentSelectedElementDetails && (currentSelectedElementDetails.tag === 'input' || currentSelectedElementDetails.tag === 'textarea') && (
              <div className="flex flex-col">
                <label htmlFor="placeholder" className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder para {currentSelectedElementDetails.tag}:
                </label>
                <input
                  type="text"
                  id="placeholder"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                  value={currentSelectedElementDetails?.content || ''}
                  onChange={(e) => updateElementProperty(selectedElement, 'content', e.target.value)}
                  disabled={!selectedElement}
                  placeholder="Escribe algo..."
                />
              </div>
            )}
             {/* Texto alternativo para etiquetas img */}
             {currentSelectedElementDetails && currentSelectedElementDetails.tag === 'img' && (
              <div className="flex flex-col">
                <label htmlFor="altText" className="block text-sm font-medium text-gray-700 mb-1">
                  Texto alternativo para imagen:
                </label>
                <input
                  type="text"
                  id="altText"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                  value={currentSelectedElementDetails?.content || ''}
                  onChange={(e) => updateElementProperty(selectedElement, 'content', e.target.value)}
                  disabled={!selectedElement}
                  placeholder="Imagen descriptiva"
                />
              </div>
            )}

            {/* Dropdown de Clases Tailwind */}
            <div className="flex flex-col">
              <label htmlFor="tailwindClass" className="block text-sm font-medium text-gray-700 mb-1">
                Clases Tailwind CSS Disponibles:
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="tailwindClass"
                  className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                  onChange={(e) => {
                    if (selectedElement && e.target.value) {
                      addClassToElement(selectedElement, e.target.value);
                      e.target.value = ''; // Resetear el dropdown
                    }
                  }}
                  disabled={!selectedElement}
                >
                  <option value="">Selecciona una clase...</option>
                  {tailwindClassesGrouped.map((group, index) => (
                    <optgroup key={index} label={group.category}>
                      {group.classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <button
                  onClick={addRootElement}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md shadow-sm transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  title="Añadir nuevo elemento raíz"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Input "Nivel" (solo lectura) */}
            <div className="flex flex-col">
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel:
                </label>
                <input
                    type="number"
                    id="level"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
                    value={currentSelectedElementDetails?.level || 0}
                    readOnly
                    disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                    El nivel indica la profundidad de anidamiento y se actualiza automáticamente al añadir o eliminar hijos.
                </p>
            </div>
          </div>

          {/* Sección de Ejemplos Pre-elaborados */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Ejemplos Pre-elaborados</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <select
                id="predefinedExample"
                className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => loadPredefinedExample(predefinedComponents.find(comp => comp.name === e.target.value)?.tree || [])}
              >
                <option value="">Selecciona un ejemplo...</option>
                {predefinedComponents.map((comp, index) => (
                  <option key={index} value={comp.name}>{comp.name}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (document.getElementById('predefinedExample').value) {
                    loadPredefinedExample(predefinedComponents.find(comp => comp.name === document.getElementById('predefinedExample').value)?.tree || []);
                  } else {
                    alert("Por favor, selecciona un ejemplo para cargar.");
                  }
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-md shadow-sm transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                title="Cargar ejemplo seleccionado"
              >
                Cargar Ejemplo
              </button>
            </div>
          </div>

          {/* Sección de Guardar/Cargar Componentes */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Tu Catálogo de Componentes</h2>
          <div className="space-y-4 mb-6">
            <button
              onClick={saveComponent}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-md shadow-sm transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Guardar Componente Actual
            </button>
            <div className="flex items-center gap-2">
              <select
                id="savedComponentSelector"
                className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedSavedComponentId}
                onChange={(e) => setSelectedSavedComponentId(e.target.value)}
              >
                <option value="">Selecciona un componente guardado...</option>
                {savedComponents.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
              </select>
              <button
                onClick={loadSavedComponent}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md shadow-sm transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                title="Cargar componente seleccionado"
              >
                Cargar
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {savedComponents.map(comp => (
                <div key={comp.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{comp.name}</span>
                  <button
                    onClick={() => deleteSavedComponent(comp.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    title="Eliminar este componente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>


          {/* Sección del Mapa */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Mapa de Componentes</h2>
          <div
            className="border border-gray-200 rounded-lg p-3 bg-gray-50 min-h-[150px] overflow-y-auto max-h-[300px]"
            onClick={() => setSelectedElement(null)}
          >
            {componentTree.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Haz clic en "+" para empezar a construir tu componente o carga un ejemplo.</p>
            ) : (
              componentTree.map(element => (
                <ComponentMapNode
                  key={element.id}
                  element={element}
                  level={0}
                  onSelect={setSelectedElement}
                  onAddChild={addChildElement}
                  onRemoveElement={removeElement}
                  selectedId={selectedElement}
                />
              ))
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">Selecciona un elemento en el mapa para editar sus propiedades y añadir clases.</p>
        </div>

        {/* Paneles Derechos: Previsualización y Código Generado */}
        <div className="flex flex-col w-full lg:w-1/2 space-y-6">
          {/* Sección de Previsualización */}
          <div className="p-6 bg-white shadow-xl rounded-xl flex-grow flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Vista Previa</h2>
            <div className="flex-grow border border-gray-200 rounded-lg overflow-hidden relative">
              <iframe
                ref={iframeRef}
                title="Component Preview"
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>

          {/* Sección de Código Generado */}
          <div className="p-6 bg-white shadow-xl rounded-xl flex-grow flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Código generado</h2>
            <textarea
              className="w-full flex-grow p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm text-gray-800 resize-none overflow-auto focus:outline-none"
              value={generatedCode}
              readOnly
            />
            <button
              onClick={handleDownload}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Descargar HTML
            </button>
          </div>
        </div>
      </div>
    </div>

);
};

export default App;
