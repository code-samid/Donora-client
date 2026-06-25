import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock } from "lucide-react";
import Card from "./ui/Card.jsx";
import Badge from "./ui/Badge.jsx";
import BloodBadge from "./BloodBadge.jsx";
import { STATUS_LABELS, STATUS_COLORS } from "../utils/constants.js";

// Used on the public Donation Requests page and the dashboard request tables.
export default function RequestRow({ request }) {
  const date = new Date(request.donationDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  return (
    <Card hover className="p-5 flex flex-col gap-4 fade-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <BloodBadge group={request.bloodGroup} />
          <div>
            <h3 className="font-display font-semibold text-ink dark:text-white leading-tight">{request.recipientName}</h3>
            <p className="text-xs text-ink-muted">{request.hospitalName}</p>
          </div>
        </div>
        <Badge className={STATUS_COLORS[request.status]}>{STATUS_LABELS[request.status]}</Badge>
      </div>

      <div className="space-y-1.5 text-xs text-ink-muted">
        <div className="flex items-center gap-1.5"><MapPin size={13} /> {request.recipientUpazila}, {request.recipientDistrict}</div>
        <div className="flex items-center gap-1.5"><Calendar size={13} /> {date} <Clock size={13} className="ml-2" /> {request.donationTime}</div>
      </div>

      <Link to={`/donation-requests/${request._id}`} className="self-start text-sm font-medium text-brand-500 hover:underline">
        View details →
      </Link>
    </Card>
  );
}
