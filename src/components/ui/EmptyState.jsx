import { Droplets } from "lucide-react";
import Button from "./Button.jsx";

export default function EmptyState({ title, description, actionLabel, onAction, icon: Icon = Droplets }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-500">
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-lg font-medium text-ink dark:text-white">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{description}</p>}
      {actionLabel && (
        <div className="mt-5">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
