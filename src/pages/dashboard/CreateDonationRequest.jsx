import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/client.js";
import Card from "../../components/ui/Card.jsx";
import DonationRequestForm from "../../components/dashboard/DonationRequestForm.jsx";

export default function CreateDonationRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values) {
    setLoading(true);
    try {
      await api.post("/donation-requests", values);
      toast.success("Donation request created");
      navigate("/dashboard/my-donation-requests");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white mb-1">Create Donation Request</h1>
      <p className="text-ink-muted mb-6">Fill in the details so nearby donors can help.</p>
      <Card className="p-6 max-w-2xl">
        <DonationRequestForm onSubmit={onSubmit} loading={loading} submitLabel="Request" />
      </Card>
    </div>
  );
}
