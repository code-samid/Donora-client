import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DonationRequests from "./pages/DonationRequests.jsx";
import DonationRequestDetail from "./pages/DonationRequestDetail.jsx";
import SearchDonors from "./pages/SearchDonors.jsx";
import NotFound from "./pages/NotFound.jsx";

import DashboardHome from "./pages/dashboard/DashboardHome.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import MyDonationRequests from "./pages/dashboard/MyDonationRequests.jsx";
import CreateDonationRequest from "./pages/dashboard/CreateDonationRequest.jsx";
import EditDonationRequest from "./pages/dashboard/EditDonationRequest.jsx";
import AllUsers from "./pages/dashboard/AllUsers.jsx";
import AllBloodDonationRequest from "./pages/dashboard/AllBloodDonationRequest.jsx";
import Funding from "./pages/dashboard/Funding.jsx";
import FundingSuccess from "./pages/dashboard/FundingSuccess.jsx";

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { fontSize: "14px", borderRadius: "10px" } }} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donation-requests" element={<DonationRequests />} />
          <Route path="/search" element={<SearchDonors />} />
        </Route>

        {/* Private: donation request details page (redirects to login when logged out) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/donation-requests/:id" element={<DonationRequestDetail />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/funding" element={<Funding />} />
            <Route path="/dashboard/funding/success" element={<FundingSuccess />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["donor"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/my-donation-requests" element={<MyDonationRequests />} />
            <Route path="/dashboard/create-donation-request" element={<CreateDonationRequest />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["donor", "admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/edit-donation-request/:id" element={<EditDonationRequest />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["admin", "volunteer"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/all-blood-donation-request" element={<AllBloodDonationRequest />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/all-users" element={<AllUsers />} />
          </Route>
        </Route>

        <Route element={<Layout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
