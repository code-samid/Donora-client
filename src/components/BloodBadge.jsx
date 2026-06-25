export default function BloodBadge({ group, size = "md" }) {
  const sizes = {
    sm: "h-8 w-8 text-[10px] rounded-lg",
    md: "h-10 w-10 text-xs rounded-xl",
    lg: "h-14 w-14 text-sm rounded-xl",
  };
  return (
    <span className={`flex shrink-0 items-center justify-center bg-brand-500 font-bold text-white shadow-sm ${sizes[size]}`}>
      {group}
    </span>
  );
}
