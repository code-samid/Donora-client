import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, Calendar, Clock, Building2, ArrowLeft, X } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import BloodBadge from "../components/BloodBadge.jsx";
import { STATUS_LABELS, STATUS_COLORS } from "../utils/constants.js";

export default function DonationRequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function load() {
    setLoading(true);
    api.get(`/donation-requests/${id}`).then((res) => setRequest(res.data.request)).finally(() => setLoading(false));
  }
  useEffect(load, [id]);

  async function confirmDonation() {
    setConfirming(true);
    try {
      await api.patch(`/donation-requests/${id}/donate`);
      toast.success("Thank you — you're confirmed as the donor.");
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not confirm donation");
    } finally {
      setConfirming(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-3xl px-5 py-16 text-center text-ink-muted">Loading request…</div>;
  if (!request) return <div className="mx-auto max-w-3xl px-5 py-16 text-center text-ink-muted">Request not found.</div>;

  const date = new Date(request.donationDate).toLocaleDateString(undefined, { dateStyle: "long" });
  const isOwner = user && request.requester?._id === user._id;
  const canDonate = user && request.status === "pending" && !isOwner;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/donation-requests" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand-500 mb-6">
        <ArrowLeft size={14} /> Back to requests
      </Link>

      <Card className="p-8 fade-up">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <BloodBadge group={request.bloodGroup} size="lg" />
            <div>
              <h1 className="font-display text-2xl font-bold text-ink dark:text-white">{request.recipientName}</h1>
              <p className="text-sm text-ink-muted">Requested by {request.requester?.name}</p>
            </div>
          </div>
          <Badge className={STATUS_COLORS[request.status]}>{STATUS_LABELS[request.status]}</Badge>
        </div>

        <p className="mt-6 text-ink-soft dark:text-gray-300">{request.requestMessage}</p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-ink-soft dark:text-gray-300"><Building2 size={15} className="text-brand-500" /> {request.hospitalName}</div>
          <div className="flex items-center gap-2 text-ink-soft dark:text-gray-300"><MapPin size={15} className="text-brand-500" /> {request.recipientUpazila}, {request.recipientDistrict}</div>
          <div className="flex items-center gap-2 text-ink-soft dark:text-gray-300"><Calendar size={15} className="text-brand-500" /> {date}</div>
          <div className="flex items-center gap-2 text-ink-soft dark:text-gray-300"><Clock size={15} className="text-brand-500" /> {request.donationTime}</div>
        </div>

        <p className="mt-4 text-sm text-ink-muted">{request.fullAddress}</p>

        {request.donor && (
          <div className="mt-6 rounded-xl bg-bg-dim dark:bg-slate-800 p-4 text-sm">
            <span className="font-medium text-ink dark:text-white">Donor confirmed:</span> {request.donor.name} · {request.donor.email}
          </div>
        )}

        {canDonate && (
          <div className="mt-8">
            <Button onClick={() => setModalOpen(true)}>Donate</Button>
          </div>
        )}
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <Card className="relative w-full max-w-sm p-6 fade-up">
            <button onClick={() => setModalOpen(false)} className="absolute right-4 top-4 text-ink-muted hover:text-ink dark:hover:text-white" aria-label="Close">
              <X size={18} />
            </button>
            <h3 className="font-display text-lg font-bold text-ink dark:text-white pr-6">Confirm your donation</h3>
            <p className="mt-1 text-sm text-ink-muted">We'll share your contact info with the requester.</p>
            <div className="mt-5 space-y-3">
              <Input label="Donor name" value={user?.name || ""} readOnly disabled />
              <Input label="Donor email" value={user?.email || ""} readOnly disabled />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={confirmDonation} loading={confirming}>Confirm</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
