import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MoreVertical, Users } from "lucide-react";
import api from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Select from "../../components/ui/Select.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { SkeletonRow } from "../../components/ui/Skeleton.jsx";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";

// Three-dot action dropdown
function ActionMenu({ targetUser, currentUserId, onAction }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Prevent admin from acting on their own account
  const isSelf = targetUser._id === currentUserId;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-bg-dim dark:hover:bg-slate-800 text-ink-muted transition-colors"
        aria-label="User actions"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-52 rounded-xl border border-line dark:border-slate-line bg-surface dark:bg-slate-900 shadow-xl py-1.5 text-sm">

          {/* ── Status toggle ── */}
          {isSelf ? (
            <p className="px-4 py-2.5 text-xs text-ink-muted italic">Cannot modify own account</p>
          ) : (
            <>
              {targetUser.status === "active" ? (
                <button
                  onClick={() => { setOpen(false); onAction("status", "blocked"); }}
                  className="block w-full px-4 py-2.5 text-left font-medium text-red-600 hover:bg-bg-dim dark:hover:bg-slate-800"
                >
                  Block user
                </button>
              ) : (
                <button
                  onClick={() => { setOpen(false); onAction("status", "active"); }}
                  className="block w-full px-4 py-2.5 text-left font-medium text-success hover:bg-bg-dim dark:hover:bg-slate-800"
                >
                  Unblock user
                </button>
              )}

              {/* ── Divider ── */}
              <div className="my-1 border-t border-line dark:border-slate-line" />

              {/* ── Role buttons — show all roles the user is NOT already ── */}
              {targetUser.role !== "donor" && (
                <button
                  onClick={() => { setOpen(false); onAction("role", "donor"); }}
                  className="block w-full px-4 py-2.5 text-left font-medium text-ink-muted hover:bg-bg-dim dark:hover:bg-slate-800"
                >
                  Make Donor
                </button>
              )}

              {targetUser.role !== "volunteer" && (
                <button
                  onClick={() => { setOpen(false); onAction("role", "volunteer"); }}
                  className="block w-full px-4 py-2.5 text-left font-medium text-sky-600 hover:bg-bg-dim dark:hover:bg-slate-800"
                >
                  Make Volunteer
                </button>
              )}

              {targetUser.role !== "admin" && (
                <button
                  onClick={() => { setOpen(false); onAction("role", "admin"); }}
                  className="block w-full px-4 py-2.5 text-left font-medium text-brand-600 hover:bg-bg-dim dark:hover:bg-slate-800"
                >
                  Make Admin
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function AllUsers() {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState({ users: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  // Confirmation modal state
  const [confirm, setConfirm] = useState(null); // { userId, field, value, label }

  function load() {
    setLoading(true);
    const params = { page, limit: 10 };
    if (status) params.status = status;
    api
      .get("/users", { params })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }

  useEffect(load, [status, page]);

  // Called by ActionMenu — opens confirmation before committing
  function requestAction(userId, field, value) {
    const labels = {
      status: { blocked: "Block this user?", active: "Unblock this user?" },
      role: {
        donor: "Demote to Donor?",
        volunteer: "Promote to Volunteer?",
        admin: "Promote to Admin?",
      },
    };
    setConfirm({ userId, field, value, label: labels[field]?.[value] ?? "Confirm action?" });
  }

  async function commitAction() {
    if (!confirm) return;
    const { userId, field, value } = confirm;
    setConfirm(null);
    try {
      await api.patch(`/users/${userId}/${field}`, { [field]: value });
      toast.success("User updated successfully");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update user");
    }
  }

  const roleColors = {
    admin: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
    volunteer: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    donor: "bg-bg-dim text-ink-soft dark:bg-slate-800 dark:text-gray-300",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-ink dark:text-white md:text-3xl">
          All Users
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Manage roles and account status across the platform.
        </p>
      </div>

      <div className="mb-4 max-w-xs">
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </Select>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
        ) : data.users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Try adjusting the status filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line dark:border-slate-line bg-bg-dim dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Avatar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-line dark:border-slate-line last:border-0 hover:bg-bg-dim/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-50 dark:bg-brand-500/15 font-bold text-xs text-brand-600">
                        {u.avatar ? (
                          <img src={u.avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          u.name?.[0]?.toUpperCase()
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink dark:text-white">
                      {u.name}
                      {u._id === currentUser?._id && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                          (you)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge className={roleColors[u.role] || ""}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          u.status === "active"
                            ? "bg-success-50 text-success"
                            : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        }
                      >
                        {u.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ActionMenu
                        targetUser={u}
                        currentUserId={currentUser?._id}
                        onAction={(field, value) => requestAction(u._id, field, value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Pagination page={data.page} pages={data.pages} onChange={setPage} />

      {/* Confirmation modal */}
      {confirm && (
        <ConfirmModal
          title={confirm.label}
          description="This change takes effect immediately."
          confirmLabel="Yes, proceed"
          onConfirm={commitAction}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
