export default function ProductCardSolution() {
  return (
    <article className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[16/10] w-full bg-slate-100">
        <img
          alt="Producto"
          className="h-full w-full object-cover"
          src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27800%27%20height%3D%27500%27%20viewBox%3D%270%200%20800%20500%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23e2e8f0%27/%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23cbd5e1%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%27800%27%20height%3D%27500%27%20fill%3D%27url(%23g)%27/%3E%3Ctext%20x%3D%2750%25%27%20y%3D%2750%25%27%20dominant-baseline%3D%27middle%27%20text-anchor%3D%27middle%27%20font-family%3D%27ui-sans-serif%2C%20system-ui%27%20font-size%3D%2736%27%20fill%3D%27%23334155%27%20opacity%3D%270.8%27%3EProducto%3C/text%3E%3C/svg%3E"
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">Reloj minimal</h3>
          <p className="text-sm text-slate-600">Edición 2026</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-slate-900">$49.00</p>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
          >
            Añadir
          </button>
        </div>
      </div>
    </article>
  );
}
