import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, User as UserIcon, ClipboardList, PlusCircle, Users, HeartHandshake, Droplet } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function DashboardSidebar({ onNavigate }) {
  const { user } = useAuth();

  const baseLinks = [
    { to: "/dashboard", label: "Dashboard Home", icon: LayoutDashboard, end: true },
    { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
  ];

  const donorLinks = [
    { to: "/dashboard/create-donation-request", label: "Create Request", icon: PlusCircle },
    { to: "/dashboard/my-donation-requests", label: "My Requests", icon: ClipboardList },
  ];

  const adminVolunteerLinks = [{ to: "/dashboard/all-blood-donation-request", label: "All Requests", icon: ClipboardList }];
  const adminOnlyLinks = [{ to: "/dashboard/all-users", label: "All Users", icon: Users }];

  let links = [...baseLinks];
  if (user?.role === "donor") links.splice(1, 0, ...donorLinks);
  if (user?.role === "admin") links.splice(1, 0, ...adminOnlyLinks);
  if (user?.role === "admin" || user?.role === "volunteer") links.splice(2, 0, ...adminVolunteerLinks);
  links.push({ to: "/dashboard/funding", label: "Funding", icon: HeartHandshake });

  return (
    <div className="flex flex-col h-full bg-sidebar text-white">
      <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-white text-2xl">
            <Droplet size={22} fill="white" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">Donora</span>
        </Link>
      </div>

      <div className="px-6 mb-6 flex items-center gap-3 px-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 font-bold text-xs overflow-hidden">
          {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate">{user?.name}</p>
          <p className="text-xs text-white/60 capitalize">{user?.role} Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all ${
                isActive ? "bg-brand-500 font-bold text-white shadow-md translate-x-1" : "text-white/80 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <l.icon size={18} />
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
