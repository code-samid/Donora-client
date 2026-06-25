import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/client.js";
import Card from "../../components/ui/Card.jsx";
import DonationRequestForm from "../../components/dashboard/DonationRequestForm.jsx";

export default function EditDonationRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/donation-requests/${id}`).then((res) => setRequest(res.data.request));
  }, [id]);

  async function onSubmit(values) {
    setLoading(true);
    try {
      await api.put(`/donation-requests/${id}`, values);
      toast.success("Donation request updated");
      navigate("/dashboard/my-donation-requests");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update request");
    } finally {
      setLoading(false);
    }
  }

  if (!request) return <p className="text-ink-muted">Loading…</p>;

  const defaultValues = {
    ...request,
    donationDate: new Date(request.donationDate).toISOString().slice(0, 10),
  };

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white mb-1">Edit Donation Request</h1>
      <p className="text-ink-muted mb-6">Update the details below.</p>
      <Card className="p-6 max-w-2xl">
        <DonationRequestForm defaultValues={defaultValues} onSubmit={onSubmit} loading={loading} submitLabel="Update donation request" />
      </Card>
    </div>
  );
}
