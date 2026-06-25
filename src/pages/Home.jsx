import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Search, ShieldCheck, Clock, HeartHandshake, Phone, Mail, Send, Droplets, Users } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";

const features = [
  {
    icon: ShieldCheck,
    title: "Safe & Verified",
    body: "Every donor profile is verified with real district-matched account data so requesters know exactly who they're connecting with.",
  },
  {
    icon: Clock,
    title: "Fast Matching",
    body: "Pending requests are visible immediately to nearby donors filtered by blood group and location — no delays, no middlemen.",
  },
  {
    icon: HeartHandshake,
    title: "Built for Everyone",
    body: "Donors, volunteers, and hospital staff each get a purpose-built dashboard tailored to their role in the donation process.",
  },
  {
    icon: Droplets,
    title: "Real-Time Status",
    body: "Track every donation request from pending through in-progress to done — with full donor contact details shared at the right moment.",
  },
  {
    icon: Users,
    title: "Community Funded",
    body: "Support the network financially through our secure Stripe-powered funding page. Every contribution helps keep the platform running.",
  },
  {
    icon: Search,
    title: "District-Level Search",
    body: "Search for available donors across all 64 districts and 494 upazilas of Bangladesh using real geocode data.",
  },
];

const stats = [
  { label: "Districts covered", value: "64" },
  { label: "Blood groups", value: "8" },
  { label: "Upazilas covered", value: "494" },
];

export default function Home() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  function handleContactSubmit(e) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent — we'll get back to you soon.");
      e.target.reset();
      setSending(false);
    }, 700);
  }

  return (
    <div>
      {/* ── Hero / Banner ── */}
      <section className="relative overflow-hidden bg-brand-500 py-24 md:py-32">
        {/* subtle animated blobs */}
        <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-5 text-center text-white">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live across Bangladesh
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-[64px]">
            Connecting Donors<br />
            <span className="text-white/70">Saving Lives</span> in Real-Time.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/85 md:text-lg">
            Donora is a community blood donation platform connecting donors with patients who need them — fast, district-matched, and completely free to use.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white !text-brand-500 hover:bg-white/90 font-extrabold shadow-lg"
              onClick={() => navigate("/register")}
            >
              <HeartHandshake size={18} /> Join as a donor
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/50 !text-white hover:bg-white/10 backdrop-blur-sm font-bold"
              onClick={() => navigate("/search")}
            >
              <Search size={18} /> Search Donors
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-line dark:border-slate-line bg-bg-dim dark:bg-slate-900">
        <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-line dark:divide-slate-line">
          {stats.map((s) => (
            <div key={s.label} className="py-8 text-center">
              <p className="font-display text-3xl font-extrabold text-brand-500">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Section ── */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-500">Why Donora</p>
            <h2 className="font-display text-3xl font-extrabold text-ink dark:text-white md:text-4xl">
              Built for life-saving speed
            </h2>
          </div>
          <Link to="/donation-requests" className="flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:underline">
            See open requests <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="group p-6 hover:border-brand-500/40 transition-colors">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <f.icon size={20} />
              </span>
              <h3 className="font-display text-base font-bold text-ink dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-gray-300">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-sidebar dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center text-white">
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">Ready to help?</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/75">
            One donation can save up to three lives. Join the Donora community today and be someone's hero.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-brand-500 hover:bg-brand-400 text-white font-bold shadow-lg"
              onClick={() => navigate("/register")}
            >
              Start donating <ArrowRight size={16} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-bold"
              onClick={() => navigate("/donation-requests")}
            >
              View open requests
            </Button>
          </div>
        </div>
      </section>

      {/* ── Contact Us ── */}
      <section className="border-t border-line dark:border-slate-line">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-20 md:grid-cols-2 md:items-start">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-500">Contact Us</p>
            <h2 className="font-display text-3xl font-extrabold text-ink dark:text-white">
              Have Questions?<br />Get in Touch.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft dark:text-gray-300">
              Questions about a request, partnering as a hospital, or running a blood drive together — our support team is here 24/7.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                  <Phone size={16} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Emergency Hotline</p>
                  <p className="font-bold text-ink dark:text-white">+880 1700-000000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                  <Mail size={16} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Email Support</p>
                  <p className="font-bold text-ink dark:text-white">hello@donora.app</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-7">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Full name" placeholder="Jane Doe" required />
                <Input label="Email" type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-soft dark:text-gray-300">Subject</label>
                <select className="w-full rounded-lg border border-line dark:border-slate-line bg-surface dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15">
                  <option>Donation Eligibility</option>
                  <option>Technical Support</option>
                  <option>Partner Inquiries</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-soft dark:text-gray-300">Message</label>
                <textarea
                  rows={4}
                  required
                  className="w-full rounded-lg border border-line dark:border-slate-line bg-surface dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 resize-none"
                  placeholder="How can we help you today?"
                />
              </div>
              <Button type="submit" className="w-full" loading={sending}>
                <Send size={15} /> Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
