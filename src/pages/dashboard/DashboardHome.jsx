import { useAuth } from "../../context/AuthContext.jsx";
import DonorHome from "./DonorHome.jsx";
import AdminHome from "./AdminHome.jsx";

export default function DashboardHome() {
  const { user } = useAuth();
  if (user?.role === "donor") return <DonorHome />;
  return <AdminHome />; // admin and volunteer share the same home per spec
}
