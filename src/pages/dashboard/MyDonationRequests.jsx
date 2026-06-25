import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import Card from "../../components/ui/Card.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import DonationRequestsTable from "../../components/dashboard/DonationRequestsTable.jsx";
import { ClipboardList } from "lucide-react";

export default function MyDonationRequests() {
  const [data, setData] = useState({ requests: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  function load() {
    setLoading(true);
    const params = { page, limit: 10 };
    if (status) params.status = status;
    api.get("/donation-requests/mine", { params }).then((res) => setData(res.data)).finally(() => setLoading(false));
  }
  useEffect(load, [status, page]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white">My Donation Requests</h1>
          <p className="text-ink-muted">Everything you've requested.</p>
        </div>
        <Link to="/dashboard/create-donation-request"><Button>New request</Button></Link>
      </div>

      <div className="mb-4 max-w-xs">
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </Select>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-ink-muted">Loading…</p>
        ) : data.requests.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No donation requests yet"
            description="Create your first donation request to find a matching donor."
            actionLabel="Create your first request"
            onAction={() => (window.location.href = "/dashboard/create-donation-request")}
          />
        ) : (
          <DonationRequestsTable requests={data.requests} mode="donor" onChanged={load} />
        )}
      </Card>
      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </div>
  );
}
