import { useEffect, useState } from "react";
import api from "../api/client.js";

// Real Bangladesh districts (64) and upazilas (494), served from the API
// which sources its data from the bangladesh-geocode dataset.
export function useDistricts() {
  const [districts, setDistricts] = useState([]);
  useEffect(() => {
    api.get("/locations/districts").then((res) => setDistricts(res.data.districts));
  }, []);
  return districts;
}

export function useUpazilas(districtName) {
  const [upazilas, setUpazilas] = useState([]);
  useEffect(() => {
    if (!districtName) {
      setUpazilas([]);
      return;
    }
    api.get("/locations/upazilas", { params: { district: districtName } }).then((res) => setUpazilas(res.data.upazilas));
  }, [districtName]);
  return upazilas;
}
