import { Link } from "react-router-dom";
import { Droplet } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line dark:border-slate-line bg-bg-dim dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-white">
                <Droplet size={14} fill="white" />
              </span>
              <span className="font-display font-extrabold text-ink dark:text-white">Donora</span>
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
              Connecting blood donors with those in need — district by district, across all of Bangladesh.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-ink border-b border-brand-500/20 pb-2 inline-block dark:text-white">Platform</h5>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li><Link to="/" className="hover:text-brand-500 transition-colors">Home</Link></li>
              <li><Link to="/donation-requests" className="hover:text-brand-500 transition-colors">Donation Requests</Link></li>
              <li><Link to="/search" className="hover:text-brand-500 transition-colors">Search Donors</Link></li>
              <li><Link to="/dashboard/funding" className="hover:text-brand-500 transition-colors">Funding</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-ink border-b border-brand-500/20 pb-2 inline-block dark:text-white">Account</h5>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              <li><Link to="/register" className="hover:text-brand-500 transition-colors">Become a donor</Link></li>
              <li><Link to="/login" className="hover:text-brand-500 transition-colors">Login</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-500 transition-colors">Dashboard</Link></li>
              <li><Link to="/dashboard/profile" className="hover:text-brand-500 transition-colors">My Profile</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-ink border-b border-brand-500/20 pb-2 inline-block dark:text-white">Stay Updated</h5>
            <p className="mb-3 text-sm text-ink-muted">Subscribe for donation drives and urgent blood request alerts.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 rounded-lg border border-line dark:border-slate-line bg-surface dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
              <button className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-bold text-white hover:bg-brand-400 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line dark:border-slate-line pt-6 text-xs text-ink-muted sm:flex-row">
          <p>© {year} Donora Blood Donation Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
