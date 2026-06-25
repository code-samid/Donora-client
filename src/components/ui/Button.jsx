import clsx from "clsx";

const variants = {
  primary: "bg-brand-500 text-white hover:bg-brand-400 shadow-sm shadow-brand-500/20",
  dark: "bg-sidebar text-white hover:opacity-90",
  outline: "border border-line dark:border-slate-line text-ink dark:text-white hover:bg-bg-dim dark:hover:bg-slate-800",
  ghost: "text-ink-soft dark:text-gray-300 hover:bg-bg-dim dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-success text-white hover:opacity-90",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({ variant = "primary", size = "md", loading = false, className = "", children, disabled, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-150",
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      {children}
    </button>
  );
}
