import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import api from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import DonationRequestsTable from "../../components/dashboard/DonationRequestsTable.jsx";
import { SkeletonRow } from "../../components/ui/Skeleton.jsx";

// Spec: welcome message + max 3 recent own requests (tabular)
// + "view my all request" button below the table
export default function DonorHome() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api.get("/donation-requests/mine/recent")
      .then((res) => setRequests(res.data.requests))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-8 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 left-20 h-32 w-32 rounded-full bg-black/10 blur-xl" />
        <div className="relative">
          <h1 className="font-display text-2xl font-extrabold md:text-3xl">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Your contributions are saving lives. Here are your most recent blood donation requests.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dashboard/create-donation-request">
              <Button className="bg-white !text-brand-500 hover:bg-white/90 font-bold text-sm shadow">
                <PlusCircle size={15} /> New Request
              </Button>
            </Link>
            <Link to="/dashboard/my-donation-requests">
              <Button variant="outline" className="border-white/30 !text-white hover:bg-white/10 text-sm font-bold">
                View all requests
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent requests table */}
      <div>
        <h2 className="font-display text-lg font-bold text-ink dark:text-white mb-4">Recent Donation Requests</h2>
        <Card className="overflow-hidden">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          ) : requests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-ink-muted text-sm">You haven't made any donation requests yet.</p>
              <Link to="/dashboard/create-donation-request" className="inline-block mt-4">
                <Button size="sm">Create your first request</Button>
              </Link>
            </div>
          ) : (
            <DonationRequestsTable requests={requests} mode="donor" onChanged={load} />
          )}
        </Card>

        {/* Spec: "view my all request" button always shown below the table */}
        <div className="mt-5 text-center">
          <Link to="/dashboard/my-donation-requests">
            <Button variant="outline">View my all requests</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
