import clsx from "clsx";

export default function Card({ className = "", children, hover = false, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-line dark:border-slate-line bg-surface dark:bg-slate-900",
        "shadow-[0_1px_2px_rgba(20,24,31,0.04)]",
        hover && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(20,24,31,0.08)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
