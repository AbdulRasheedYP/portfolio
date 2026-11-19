import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-slate-200 flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-5">
        <h1 className="text-7xl font-extrabold text-primary drop-shadow-[0_0_25px_rgba(0,217,255,0.4)]">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-slate-400 text-sm">
          The page you are looking for doesn't exist or has been moved to another URL.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover transition-colors text-sm shadow-lg shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
