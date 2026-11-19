import React from "react";

export const SkeletonCard = ({ className = "" }) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 overflow-hidden relative animate-pulse ${className}`}
    >
      <div className="w-full h-44 bg-slate-800/60 rounded-xl mb-4" />
      <div className="h-4 bg-slate-800/60 rounded w-1/3 mb-3" />
      <div className="h-6 bg-slate-800/80 rounded w-3/4 mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-3.5 bg-slate-800/50 rounded w-full" />
        <div className="h-3.5 bg-slate-800/50 rounded w-5/6" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-slate-800/60 rounded-full w-16" />
        <div className="h-6 bg-slate-800/60 rounded-full w-20" />
      </div>
    </div>
  );
};

export const SkeletonDetail = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-pulse space-y-6">
      <div className="h-4 bg-slate-800/60 rounded w-28" />
      <div className="h-10 bg-slate-800/80 rounded w-2/3" />
      <div className="w-full h-80 bg-slate-800/50 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-4 bg-slate-800/50 rounded w-full" />
        <div className="h-4 bg-slate-800/50 rounded w-11/12" />
        <div className="h-4 bg-slate-800/50 rounded w-3/4" />
      </div>
    </div>
  );
};
