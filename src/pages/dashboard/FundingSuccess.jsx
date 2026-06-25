import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import api from "../../api/client.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";

export default function FundingSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("checking");
  const [funding, setFunding] = useState(null);

  useEffect(() => {
    if (!sessionId) { setStatus("missing"); return; }
    let attempts = 0;
    let cancelled = false;

    async function poll() {
      try {
        const res = await api.get(`/funding/session/${sessionId}`);
        if (cancelled) return;
        setFunding(res.data.funding);
        if (res.data.funding.status === "succeeded") return setStatus("succeeded");
        if (res.data.funding.status === "failed") return setStatus("failed");
        attempts += 1;
        if (attempts < 8) setTimeout(poll, 1500);
        else setStatus("pending");
      } catch {
        if (!cancelled) setStatus("pending");
      }
    }
    poll();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <div className="max-w-md mx-auto py-10 text-center">
      <Card className="p-8">
        {status === "checking" && (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
            <h1 className="font-display text-xl font-bold text-ink dark:text-white">Confirming your payment…</h1>
          </>
        )}
        {status === "succeeded" && (
          <>
            <CheckCircle2 className="mx-auto mb-4 text-success" size={40} />
            <h1 className="font-display text-xl font-bold text-ink dark:text-white">Thank you for your contribution</h1>
            <p className="mt-2 text-sm text-ink-muted">${funding?.amount} received.</p>
            <Link to="/dashboard/funding" className="inline-block mt-6"><Button>Back to funding</Button></Link>
          </>
        )}
        {status === "pending" && (
          <>
            <Clock className="mx-auto mb-4 text-warning" size={40} />
            <h1 className="font-display text-xl font-bold text-ink dark:text-white">Payment still processing</h1>
            <Link to="/dashboard/funding" className="inline-block mt-6"><Button variant="outline">Back to funding</Button></Link>
          </>
        )}
        {(status === "failed" || status === "missing") && (
          <>
            <XCircle className="mx-auto mb-4 text-red-600" size={40} />
            <h1 className="font-display text-xl font-bold text-ink dark:text-white">Payment didn't go through</h1>
            <Link to="/dashboard/funding" className="inline-block mt-6"><Button>Try again</Button></Link>
          </>
        )}
      </Card>
    </div>
  );
}
