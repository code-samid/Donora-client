import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Droplet } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit(data) {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back");
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-5 py-12 bg-bg-dim/30 dark:bg-slate-900/30">
      <Card className="w-full max-w-md p-8 fade-up">
        <div className="flex flex-col items-center mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white mb-3">
            <Droplet size={18} fill="white" />
          </span>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-white">Welcome back</h1>
          <p className="text-sm text-ink-muted mt-1">Sign in to your Donora account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email", { required: "Email is required" })} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password", { required: "Password is required" })} />
          <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          New here? <Link to="/register" className="font-medium text-brand-500 hover:underline">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
