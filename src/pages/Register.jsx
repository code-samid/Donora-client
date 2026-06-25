import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Droplet, Upload } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { uploadToImgbb } from "../api/imgbb.js";
import { useDistricts, useUpazilas } from "../hooks/useLocations.js";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { BLOOD_GROUPS } from "../utils/constants.js";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const districts = useDistricts();
  const upazilas = useUpazilas(selectedDistrict);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setAvatarUrl(url);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err.message || "Could not upload photo");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data) {
    setLoading(true);
    try {
      await registerUser({ ...data, avatar: avatarUrl });
      toast.success("Account created — welcome to Donora");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-5 py-12 bg-bg-dim/30 dark:bg-slate-900/30">
      <Card className="w-full max-w-lg p-8 fade-up">
        <div className="flex flex-col items-center mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white mb-3">
            <Droplet size={18} fill="white" />
          </span>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-white">Become a donor</h1>
          <p className="text-sm text-ink-muted mt-1">Two minutes now, a life saved later</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <label className="relative cursor-pointer">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-dim dark:bg-slate-800 border-2 border-dashed border-line dark:border-slate-line overflow-hidden">
                {avatarPreview ? <img src={avatarPreview} alt="" className="h-full w-full object-cover" /> : <Upload size={20} className="text-ink-muted" />}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
            <span className="text-xs text-ink-muted">{uploading ? "Uploading…" : "Upload profile photo"}</span>
          </div>

          <Input label="Full name" placeholder="Jane Doe" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email", { required: "Email is required" })} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Password" type="password" placeholder="At least 6 characters" error={errors.password?.message} {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 characters" } })} />
            <Input
              label="Confirm password"
              type="password"
              placeholder="Repeat password"
              error={errors.confirm_password?.message}
              {...register("confirm_password", { required: "Required", validate: (v) => v === password || "Passwords do not match" })}
            />
          </div>

          <Select label="Blood group" error={errors.bloodGroup?.message} {...register("bloodGroup", { required: "Required" })}>
            <option value="">Select</option>
            {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="District"
              error={errors.district?.message}
              {...register("district", { required: "Required" })}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">Select district</option>
              {districts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
            </Select>
            <Select label="Upazila" error={errors.upazila?.message} disabled={!selectedDistrict} {...register("upazila", { required: "Required" })}>
              <option value="">{selectedDistrict ? "Select upazila" : "Pick a district first"}</option>
              {upazilas.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
            </Select>
          </div>

          <Button type="submit" className="w-full" loading={loading}>Create account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Already registered? <Link to="/login" className="font-medium text-brand-500 hover:underline">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
