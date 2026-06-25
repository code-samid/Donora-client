import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import api from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Select from "../../components/ui/Select.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import DonationRequestsTable from "../../components/dashboard/DonationRequestsTable.jsx";

export default function AllBloodDonationRequest() {
  const { user } = useAuth();
  const [data, setData] = useState({ requests: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  function load() {
    setLoading(true);
    const params = { page, limit: 10 };
    if (status) params.status = status;
    api.get("/donation-requests", { params }).then((res) => setData(res.data)).finally(() => setLoading(false));
  }
  useEffect(load, [status, page]);

  // Admin: full privilege (same as a donor managing their own requests, but for everyone).
  // Volunteer: status updates only.
  const mode = user?.role === "admin" ? "admin" : "volunteer";

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white">All Blood Donation Requests</h1>
        <p className="text-ink-muted">{mode === "admin" ? "Manage every donation request on the platform." : "Update donation status as requests progress."}</p>
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
          <EmptyState icon={ClipboardList} title="No donation requests found" />
        ) : (
          <DonationRequestsTable requests={data.requests} mode={mode} onChanged={load} />
        )}
      </Card>
      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </div>
  );
}
