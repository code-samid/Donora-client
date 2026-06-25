import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext.jsx";
import { useDistricts, useUpazilas } from "../../hooks/useLocations.js";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import { BLOOD_GROUPS } from "../../utils/constants.js";

export default function DonationRequestForm({ defaultValues, onSubmit, loading, submitLabel }) {
  const { user } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: defaultValues || { recipientDistrict: "", recipientUpazila: "" },
  });

  const selectedDistrict = watch("recipientDistrict");
  const districts = useDistricts();
  const upazilas = useUpazilas(selectedDistrict);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Requester name" value={user?.name || ""} disabled readOnly />
        <Input label="Requester email" value={user?.email || ""} disabled readOnly />
      </div>

      <Input label="Recipient name" error={errors.recipientName?.message} {...register("recipientName", { required: "Required" })} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Select label="Recipient district" error={errors.recipientDistrict?.message} {...register("recipientDistrict", { required: "Required" })}>
          <option value="">Select district</option>
          {districts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
        </Select>
        <Select label="Recipient upazila" disabled={!selectedDistrict} error={errors.recipientUpazila?.message} {...register("recipientUpazila", { required: "Required" })}>
          <option value="">{selectedDistrict ? "Select upazila" : "Pick a district first"}</option>
          {upazilas.length === 0 && defaultValues?.recipientUpazila && <option value={defaultValues.recipientUpazila}>{defaultValues.recipientUpazila}</option>}
          {upazilas.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
        </Select>
      </div>

      <Input label="Hospital name" placeholder="e.g. Dhaka Medical College Hospital" error={errors.hospitalName?.message} {...register("hospitalName", { required: "Required" })} />
      <Input label="Full address line" placeholder="e.g. Zahir Raihan Rd, Dhaka" error={errors.fullAddress?.message} {...register("fullAddress", { required: "Required" })} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Select label="Blood group" error={errors.bloodGroup?.message} {...register("bloodGroup", { required: "Required" })}>
          <option value="">Select</option>
          {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
        </Select>
        <div className="grid grid-cols-2 gap-2">
          <Input label="Donation date" type="date" error={errors.donationDate?.message} {...register("donationDate", { required: "Required" })} />
          <Input label="Donation time" type="time" error={errors.donationTime?.message} {...register("donationTime", { required: "Required" })} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft dark:text-gray-300">Request message</label>
        <textarea
          rows={4}
          className="w-full rounded-lg border border-line dark:border-slate-line bg-surface dark:bg-slate-800 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none"
          placeholder="Explain why blood is needed"
          {...register("requestMessage", { required: "Required" })}
        />
        {errors.requestMessage && <p className="mt-1 text-xs text-red-500">{errors.requestMessage.message}</p>}
      </div>

      <Button type="submit" loading={loading}>{submitLabel}</Button>
    </form>
  );
}
