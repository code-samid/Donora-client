import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

const Input = forwardRef(function Input({ label, error, type = "text", className = "", id, ...props }, ref) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-soft dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          type={inputType}
          aria-invalid={!!error}
          className={clsx(
            "w-full rounded-lg border bg-surface dark:bg-slate-800 px-3.5 py-2.5 text-sm text-ink dark:text-white",
            "placeholder:text-ink-muted transition-colors duration-150",
            "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none",
            "disabled:bg-bg-dim disabled:text-ink-muted disabled:cursor-not-allowed",
            error ? "border-red-400" : "border-line dark:border-slate-line",
            isPassword && "pr-10",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink dark:hover:text-white" tabIndex={-1} aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
