import { X } from "lucide-react";
import Button from "./Button.jsx";

export default function ConfirmModal({ open, title, description, confirmLabel = "Confirm", danger = false, loading = false, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-surface dark:bg-slate-900 p-6 shadow-xl fade-up">
        <button onClick={onCancel} className="absolute right-4 top-4 text-ink-muted hover:text-ink dark:hover:text-white" aria-label="Close">
          <X size={18} />
        </button>
        <h3 className="font-display text-lg font-semibold text-ink dark:text-white pr-6">{title}</h3>
        {description && <p className="mt-2 text-sm text-ink-muted">{description}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant={danger ? "danger" : "primary"} size="sm" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
