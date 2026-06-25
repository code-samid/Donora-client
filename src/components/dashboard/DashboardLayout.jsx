import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Menu, X, Droplet, Sun, Moon, Search } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../ui/Button.jsx";

// Spec: "All of the dashboard layout will have sidebar not navbar on the top.
// The dashboard layout has to be fully responsive" + "Full-width dashboard".
export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-bg dark:bg-slate-950 w-full">
      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-0 h-screen">
          <DashboardSidebar />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64">
            <button className="absolute right-3 top-3 text-white z-10" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={18} />
            </button>
            <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 w-full">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line dark:border-slate-line bg-surface/90 dark:bg-slate-900/90 backdrop-blur-md px-5">
          <button className="md:hidden flex items-center gap-2" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={20} />
            <Link to="/" className="flex items-center gap-1.5">
              <Droplet size={16} className="text-brand-500" fill="currentColor" />
              <span className="font-bold">Donora</span>
            </Link>
          </button>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                placeholder="Quick search…"
                className="w-full rounded-full border border-line dark:border-slate-line bg-bg-dim dark:bg-slate-800 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
                disabled
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} aria-label="Toggle dark mode" className="flex h-9 w-9 items-center justify-center rounded-full border border-line dark:border-slate-line text-ink-soft dark:text-gray-300 hover:bg-bg-dim dark:hover:bg-slate-800">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }}>Logout</Button>
          </div>
        </header>
        <main className="p-5 md:p-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
