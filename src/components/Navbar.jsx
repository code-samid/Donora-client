import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, Droplet, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import Button from "./ui/Button.jsx";

// Per spec:
// Logged-out: logo | Donation Requests | Login
// Logged-in:  logo | Donation Requests | Funding | avatar dropdown (Dashboard, Logout)
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navLink = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? "text-brand-500" : "text-ink-soft dark:text-gray-300 hover:text-ink dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line dark:border-slate-line bg-surface/90 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Droplet size={16} fill="white" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink dark:text-white">Donora</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/donation-requests" className={navLink}>Donation Requests</NavLink>
          {user && <NavLink to="/dashboard/funding" className={navLink}>Funding</NavLink>}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line dark:border-slate-line text-ink-soft dark:text-gray-300 hover:bg-bg-dim dark:hover:bg-slate-800 transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-line dark:border-slate-line px-2 py-1 hover:bg-bg-dim dark:hover:bg-slate-800 transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-brand-50 dark:bg-brand-500/15 text-xs font-bold text-brand-600">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    : user.name?.[0]?.toUpperCase()}
                </span>
                <span className="max-w-[100px] truncate text-sm font-semibold text-ink dark:text-white">{user.name?.split(" ")[0]}</span>
                <ChevronDown size={14} className="text-ink-muted" />
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-line dark:border-slate-line bg-surface dark:bg-slate-900 shadow-xl py-1.5">
                    <button
                      onClick={() => { setDropdownOpen(false); navigate("/dashboard"); }}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-bg-dim dark:hover:bg-slate-800"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); navigate("/"); }}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-bg-dim dark:hover:bg-slate-800"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Login</Button>
              <Button size="sm" onClick={() => navigate("/register")}>Join as a donor</Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line dark:border-slate-line md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-line dark:border-slate-line px-5 py-4 md:hidden space-y-1">
          <NavLink to="/donation-requests" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-bg-dim dark:hover:bg-slate-800">
            Donation Requests
          </NavLink>
          {user && (
            <NavLink to="/dashboard/funding" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-bg-dim dark:hover:bg-slate-800">
              Funding
            </NavLink>
          )}
          <div className="flex items-center gap-2 pt-2">
            <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg border border-line dark:border-slate-line">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {user ? (
              <>
                <Button size="sm" className="flex-1" onClick={() => { setMobileOpen(false); navigate("/dashboard"); }}>Dashboard</Button>
                <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate("/login")}>Login</Button>
                <Button size="sm" className="flex-1" onClick={() => navigate("/register")}>Join as a donor</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
