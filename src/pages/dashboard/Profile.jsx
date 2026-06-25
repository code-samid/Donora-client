import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Pencil, Upload } from "lucide-react";
import api from "../../api/client.js";
import { uploadToImgbb } from "../../api/imgbb.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useDistricts, useUpazilas } from "../../hooks/useLocations.js";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import { BLOOD_GROUPS } from "../../utils/constants.js";

// Spec: form starts read-only. "Edit" toggles editable + shows "Save".
// After save, the form returns to its read-only state. Email is never editable.
export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  const { register, handleSubmit, watch, setValue, reset } = useForm({ defaultValues: user });
  const districtValue = watch("district");
  const districts = useDistricts();
  const upazilas = useUpazilas(districtValue);

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setValue("avatar", url);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err.message || "Could not upload photo");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values) {
    setSaving(true);
    try {
      const { name, avatar, bloodGroup, district, upazila } = values;
      const res = await api.put("/users/me", { name, avatar, bloodGroup, district, upazila });
      updateUser(res.data.user);
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    reset(user);
    setAvatarPreview(user?.avatar || "");
    setEditing(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white">Profile</h1>
          <p className="text-ink-muted">Your account details.</p>
        </div>
        {!editing && <Button variant="outline" onClick={() => setEditing(true)}><Pencil size={15} /> Edit</Button>}
      </div>

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-4">
            {editing ? (
              <label className="relative cursor-pointer">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-dim dark:bg-slate-800 border-2 border-dashed border-line dark:border-slate-line overflow-hidden">
                  {avatarPreview ? <img src={avatarPreview} alt="" className="h-full w-full object-cover" /> : <Upload size={18} className="text-ink-muted" />}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-600 font-bold overflow-hidden">
                {avatarPreview ? <img src={avatarPreview} alt="" className="h-full w-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
              </span>
            )}
            <div>
              <p className="font-display text-lg font-semibold text-ink dark:text-white">{user?.name}</p>
              <p className="text-sm text-ink-muted capitalize">{user?.role} · {user?.status}</p>
            </div>
          </div>

          <Input label="Full name" disabled={!editing} {...register("name", { required: true })} />
          <Input label="Email" value={user?.email} disabled readOnly />

          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Blood group" disabled={!editing} {...register("bloodGroup")}>
              {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
            </Select>
            <Select label="District" disabled={!editing} {...register("district")}>
              {districts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
            </Select>
          </div>
          <Select label="Upazila" disabled={!editing} {...register("upazila")}>
            {upazilas.length === 0 && user?.upazila && <option value={user.upazila}>{user.upazila}</option>}
            {upazilas.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
          </Select>

          {editing && (
            <div className="flex gap-2 pt-2">
              <Button type="submit" loading={saving}>Save</Button>
              <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
