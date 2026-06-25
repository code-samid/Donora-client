import { useEffect, useState } from "react";
import { Users, DollarSign, Droplets } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import api from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import { SkeletonStat } from "../../components/ui/Skeleton.jsx";

export default function AdminHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/stats/overview").then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  const monthly = (stats?.monthlyRequests || []).map((m) => ({ month: m._id, requests: m.count }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="mt-1 text-ink-muted">Here's what's happening across the network.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonStat key={i} />)
        ) : (
          <>
            <Card className="p-5 border-l-4 border-l-brand-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">Total Donors</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-500"><Users size={16} /></span>
              </div>
              <p className="mt-3 text-3xl font-extrabold text-ink dark:text-white">{stats?.totalDonors ?? 0}</p>
            </Card>
            <Card className="p-5 border-l-4 border-l-sidebar">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">Total Funding</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-dim text-sidebar"><DollarSign size={16} /></span>
              </div>
              <p className="mt-3 text-3xl font-extrabold text-ink dark:text-white">${stats?.totalFunding ?? 0}</p>
            </Card>
            <Card className="p-5 border-l-4 border-l-success">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">Donation Requests</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-50 text-success"><Droplets size={16} /></span>
              </div>
              <p className="mt-3 text-3xl font-extrabold text-ink dark:text-white">{stats?.totalRequests ?? 0}</p>
            </Card>
          </>
        )}
      </div>

      <Card className="p-6">
        <h2 className="font-display font-semibold mb-4">Donation requests over time</h2>
        {monthly.length === 0 ? (
          <p className="text-sm text-ink-muted py-12 text-center">Not enough data yet to chart.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="reqGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e8553d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e8553d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e8e6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="requests" stroke="#e8553d" strokeWidth={2} fill="url(#reqGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
