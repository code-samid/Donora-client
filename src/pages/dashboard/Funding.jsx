import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { HeartHandshake } from "lucide-react";
import api from "../../api/client.js";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { SkeletonRow } from "../../components/ui/Skeleton.jsx";

export default function Funding() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState({ fundings: [], page: 1, pages: 1, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { amount: 25 } });

  function load() {
    setLoading(true);
    api.get("/funding", { params: { page, limit: 10 } }).then((res) => setData(res.data)).finally(() => setLoading(false));
  }
  useEffect(load, [page]);

  useEffect(() => {
    if (searchParams.get("canceled")) toast("Checkout canceled — no charge was made.", { icon: "ℹ️" });
  }, [searchParams]);

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      const res = await api.post("/funding/create-checkout-session", { amount: Number(values.amount) });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not start checkout");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white">Funding</h1>
          <p className="text-ink-muted">All funds raised for the network.</p>
        </div>
        <Button onClick={() => { reset({ amount: 25 }); setModalOpen(true); }}><HeartHandshake size={15} /> Give Fund</Button>
      </div>

      <Card className="p-5 mb-6 inline-block">
        <p className="text-xs text-ink-muted uppercase tracking-wide">Total raised</p>
        <p className="font-display text-2xl font-bold mt-1">${data.totalAmount?.toLocaleString() || 0}</p>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        ) : data.fundings.length === 0 ? (
          <EmptyState title="No funds yet" description="Be the first to support the network." icon={HeartHandshake} />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-ink-muted border-b border-line dark:border-slate-line">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.fundings.map((f) => (
                <tr key={f._id} className="border-b border-line dark:border-slate-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink dark:text-white">{f.user?.name || "Anonymous"}</td>
                  <td className="px-4 py-3 font-mono text-brand-500">${f.amount}</td>
                  <td className="px-4 py-3 text-ink-muted">{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <Pagination page={data.page} pages={data.pages} onChange={setPage} />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <Card className="relative w-full max-w-sm p-6 fade-up">
            <h3 className="font-display text-lg font-bold text-ink dark:text-white">Give a fund</h3>
            <p className="mt-1 text-sm text-ink-muted">Payments are processed securely by Stripe.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <Input label="Amount (USD)" type="number" min={1} {...register("amount", { required: true, min: 1 })} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm" loading={submitting}>Continue to checkout</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
