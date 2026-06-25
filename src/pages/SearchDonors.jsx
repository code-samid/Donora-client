import { useState } from "react";
import { Search as SearchIcon, Users } from "lucide-react";
import api from "../api/client.js";
import { useDistricts, useUpazilas } from "../hooks/useLocations.js";
import Select from "../components/ui/Select.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import BloodBadge from "../components/BloodBadge.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { SkeletonCard } from "../components/ui/Skeleton.jsx";
import { BLOOD_GROUPS } from "../utils/constants.js";

export default function SearchDonors() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [donors, setDonors] = useState(null); // null = no search performed yet
  const [loading, setLoading] = useState(false);

  const districts = useDistricts();
  const upazilas = useUpazilas(district);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (district) params.district = district;
      if (upazila) params.upazila = upazila;
      const res = await api.get("/users/search", { params });
      setDonors(res.data.donors);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink dark:text-white">Search Donors</h1>
        <p className="mt-2 text-ink-muted">Find an available donor by blood group and location.</p>
      </div>

      <Card className="p-5 mb-8">
        <form onSubmit={handleSearch} className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Select label="Blood group" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
            <option value="">Any blood group</option>
            {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
          </Select>
          <Select label="District" value={district} onChange={(e) => { setDistrict(e.target.value); setUpazila(""); }}>
            <option value="">Any district</option>
            {districts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
          </Select>
          <Select label="Upazila" value={upazila} onChange={(e) => setUpazila(e.target.value)} disabled={!district}>
            <option value="">Any upazila</option>
            {upazilas.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
          </Select>
          <div className="flex items-end">
            <Button type="submit" className="w-full" loading={loading}><SearchIcon size={15} /> Search</Button>
          </div>
        </form>
      </Card>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : donors === null ? (
        <EmptyState icon={SearchIcon} title="Start a search" description="Pick a blood group or location above, then hit search to see matching donors." />
      ) : donors.length === 0 ? (
        <EmptyState icon={Users} title="No donors found" description="Try widening your search criteria." />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {donors.map((d) => (
            <Card key={d._id} hover className="p-5 flex flex-col gap-3 fade-up">
              <div className="flex items-center gap-3">
                <BloodBadge group={d.bloodGroup} size="lg" />
                <div>
                  <h3 className="font-display font-semibold text-ink dark:text-white">{d.name}</h3>
                  <p className="text-xs text-ink-muted">{d.upazila}, {d.district}</p>
                </div>
              </div>
              <a href={`mailto:${d.email}`} className="text-sm font-medium text-brand-500 hover:underline">Contact via email</a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
