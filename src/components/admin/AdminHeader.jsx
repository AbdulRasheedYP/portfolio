import React from "react";
import { Menu, Activity } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

export const AdminHeader = ({ title, onToggleMobile }) => {
  const { isLiveSynced } = usePortfolio();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-white capitalize">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>{isLiveSynced ? "Live Firebase" : "Ready"}</span>
        </div>
      </div>
    </header>
  );
};
