import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const items = Array.from({ length: pages }, (_, i) => i + 1).filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1);

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-6" aria-label="Pagination">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="flex h-9 w-9 items-center justify-center rounded-lg border border-line dark:border-slate-line disabled:opacity-40 hover:bg-bg-dim dark:hover:bg-slate-800" aria-label="Previous page">
        <ChevronLeft size={16} />
      </button>
      {items.map((p, idx) => (
        <span key={p} className="flex items-center">
          {idx > 0 && items[idx - 1] !== p - 1 && <span className="px-1 text-ink-muted">…</span>}
          <button onClick={() => onChange(p)} className={clsx("h-9 w-9 rounded-lg text-sm font-medium transition-colors", p === page ? "bg-brand-500 text-white" : "border border-line dark:border-slate-line hover:bg-bg-dim dark:hover:bg-slate-800")} aria-current={p === page ? "page" : undefined}>
            {p}
          </button>
        </span>
      ))}
      <button onClick={() => onChange(Math.min(pages, page + 1))} disabled={page === pages} className="flex h-9 w-9 items-center justify-center rounded-lg border border-line dark:border-slate-line disabled:opacity-40 hover:bg-bg-dim dark:hover:bg-slate-800" aria-label="Next page">
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
