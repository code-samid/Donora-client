import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Trash2, Eye, CheckCircle2, XCircle } from "lucide-react";
import api from "../../api/client.js";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import ConfirmModal from "../ui/ConfirmModal.jsx";
import BloodBadge from "../BloodBadge.jsx";
import { STATUS_LABELS, STATUS_COLORS } from "../../utils/constants.js";

/**
 * Shared table used by:
 * - Donor Dashboard Home (recent 3) + My Donation Requests (mode="donor")
 * - Admin's All Blood Donation Requests (mode="admin" — full privilege)
 * - Volunteer's All Blood Donation Requests (mode="volunteer" — status-only)
 */
export default function DonationRequestsTable({ requests, mode, onChanged }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const canEditDelete = mode === "donor" || mode === "admin";
  const canSetDoneCancel = mode === "donor" || mode === "admin"; // owner / admin control completion
  const canFreeStatus = mode === "volunteer"; // volunteer: status-only, any transition

  async function updateStatus(id, status) {
    setBusyId(id);
    try {
      await api.patch(`/donation-requests/${id}/status`, { status });
      toast.success("Status updated");
      onChanged?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setBusyId(deleteTarget);
    try {
      await api.delete(`/donation-requests/${deleteTarget}`);
      toast.success("Donation request deleted");
      onChanged?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete");
    } finally {
      setBusyId(null);
      setDeleteTarget(null);
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-ink-muted border-b border-line dark:border-slate-line">
            <tr>
              <th className="px-4 py-3 font-medium">Recipient</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Blood</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Donor info</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => {
              const date = new Date(r.donationDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
              const busy = busyId === r._id;
              return (
                <tr key={r._id} className="border-b border-line dark:border-slate-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink dark:text-white whitespace-nowrap">{r.recipientName}</td>
                  <td className="px-4 py-3 text-ink-muted whitespace-nowrap">{r.recipientUpazila}, {r.recipientDistrict}</td>
                  <td className="px-4 py-3 text-ink-muted whitespace-nowrap">{date}</td>
                  <td className="px-4 py-3 text-ink-muted whitespace-nowrap">{r.donationTime}</td>
                  <td className="px-4 py-3"><BloodBadge group={r.bloodGroup} size="sm" /></td>
                  <td className="px-4 py-3">
                    {canFreeStatus ? (
                      <select
                        value={r.status}
                        disabled={busy}
                        onChange={(e) => updateStatus(r._id, e.target.value)}
                        className="rounded-lg border border-line dark:border-slate-line bg-surface dark:bg-slate-800 px-2 py-1 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="inprogress">In progress</option>
                        <option value="done">Done</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    ) : (
                      <Badge className={STATUS_COLORS[r.status]}>{STATUS_LABELS[r.status]}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-muted whitespace-nowrap text-xs">
                    {r.status === "inprogress" && r.donor ? (
                      <>
                        {r.donor.name}
                        <br />
                        {r.donor.email}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {canSetDoneCancel && r.status === "inprogress" && (
                        <>
                          <button title="Mark done" disabled={busy} onClick={() => updateStatus(r._id, "done")} className="text-success hover:opacity-80">
                            <CheckCircle2 size={16} />
                          </button>
                          <button title="Cancel" disabled={busy} onClick={() => updateStatus(r._id, "canceled")} className="text-red-500 hover:opacity-80">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <Link to={`/donation-requests/${r._id}`} title="View" className="text-ink-muted hover:text-brand-500">
                        <Eye size={16} />
                      </Link>
                      {canEditDelete && (
                        <>
                          <Link to={`/dashboard/edit-donation-request/${r._id}`} title="Edit" className="text-ink-muted hover:text-brand-500">
                            <Pencil size={16} />
                          </Link>
                          <button title="Delete" disabled={busy} onClick={() => setDeleteTarget(r._id)} className="text-ink-muted hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this donation request?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        danger
        loading={busyId === deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
