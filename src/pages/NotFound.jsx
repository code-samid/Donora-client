import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
      <span className="font-display text-7xl font-bold text-brand-500">404</span>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink dark:text-white">Page not found</h1>
      <p className="mt-2 text-ink-muted">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="mt-6"><Button>Back home</Button></Link>
    </div>
  );
}
