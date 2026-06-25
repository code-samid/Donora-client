import { forwardRef } from "react";
import clsx from "clsx";

const Select = forwardRef(function Select({ label, error, children, className = "", id, ...props }, ref) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink-soft dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={clsx(
          "w-full rounded-lg border bg-surface dark:bg-slate-800 px-3.5 py-2.5 text-sm text-ink dark:text-white",
          "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none transition-colors",
          "disabled:bg-bg-dim disabled:cursor-not-allowed",
          error ? "border-red-400" : "border-line dark:border-slate-line",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Select;
