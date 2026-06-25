import { useEffect, useState } from "react";
import { Droplets } from "lucide-react";
import api from "../api/client.js";
import RequestRow from "../components/RequestRow.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { SkeletonCard } from "../components/ui/Skeleton.jsx";

// Public page — pending requests only, per spec.
export default function DonationRequests() {
  const [data, setData] = useState({ requests: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get("/donation-requests/public", { params: { page, limit: 9 } }).then((res) => setData(res.data)).finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink dark:text-white">Donation Requests</h1>
        <p className="mt-2 text-ink-muted">Open requests waiting for a matching donor.</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : data.requests.length === 0 ? (
        <EmptyState icon={Droplets} title="No open requests right now" description="That's a good thing — check back soon." />
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">{data.requests.map((r) => <RequestRow key={r._id} request={r} />)}</div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
