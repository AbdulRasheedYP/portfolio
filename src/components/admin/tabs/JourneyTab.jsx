import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Loader2,
  X,
  Milestone,
  CheckCircle2,
  Calendar,
  Sparkles
} from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useToast } from "../../../context/ToastContext";
import {
  addJourneyDoc,
  updateJourneyDoc,
  deleteJourneyDoc
} from "../../../firebase/services";
import { FALLBACK_JOURNEY } from "../../../constants/fallbackData";

export const JourneyTab = () => {
  const { journey } = usePortfolio();
  const toast = useToast();

  const [formData, setFormData] = useState({
    period: "",
    title: "",
    subtitle: "",
    badge: "",
    icon: "Code2",
    type: "tech",
    order: 1,
    current: false,
    description: "",
    skillsInput: ""
  });

  const [editingMilestone, setEditingMilestone] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const displayList = Array.isArray(journey) && journey.length > 0 ? journey : FALLBACK_JOURNEY;

  const handleStartEdit = (item) => {
    setEditingMilestone(item);
    setFormData({
      period: item.period || "",
      title: item.title || "",
      subtitle: item.subtitle || "",
      badge: item.badge || "",
      icon: item.icon || "Code2",
      type: item.type || "tech",
      order: item.order || 1,
      current: Boolean(item.current),
      description: item.description || "",
      skillsInput: Array.isArray(item.skills) ? item.skills.join(", ") : ""
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingMilestone(null);
    setFormData({
      period: "",
      title: "",
      subtitle: "",
      badge: "",
      icon: "Code2",
      type: "tech",
      order: (displayList.length || 0) + 1,
      current: false,
      description: "",
      skillsInput: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.period.trim()) {
      toast.error("Please enter a Title and Period");
      return;
    }

    const skillsArray = formData.skillsInput
      ? formData.skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      period: formData.period.trim(),
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      badge: formData.badge.trim(),
      icon: formData.icon,
      type: formData.type,
      order: Number(formData.order) || 1,
      current: Boolean(formData.current),
      description: formData.description.trim(),
      skills: skillsArray
    };

    setSubmitting(true);
    try {
      if (editingMilestone && editingMilestone.id) {
        await updateJourneyDoc(editingMilestone.id, payload);
        toast.success(`Milestone "${formData.title}" updated!`);
      } else {
        await addJourneyDoc(payload);
        toast.success(`Milestone "${formData.title}" added to timeline!`);
      }
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save milestone: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete milestone "${item.title}"?`)) return;

    if (!item.id || item.id.startsWith("j-")) {
      toast.info("This is a built-in default item. Save any change to sync customized items to your database.");
      return;
    }

    setDeletingId(item.id);
    try {
      await deleteJourneyDoc(item.id);
      if (editingMilestone && editingMilestone.id === item.id) {
        handleCancelEdit();
      }
      toast.success(`Milestone "${item.title}" deleted`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete milestone: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm("Initialize Firebase with default Journey milestones?")) return;
    setSeeding(true);
    try {
      for (const item of FALLBACK_JOURNEY) {
        const { id, ...rest } = item;
        await addJourneyDoc(rest);
      }
      toast.success("Initialized default Journey milestones in Firebase!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to seed: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Milestone className="w-5 h-5 text-primary" />
            <span>My Journey & Learning Timeline</span>
          </h2>
          <p className="text-sm text-slate-400">
            Manage your career progression and month-by-month Brototype learning roadmap.
          </p>
        </div>

        {(!journey || journey.length === 0) && (
          <button
            type="button"
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all"
          >
            {seeding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Seed Default Milestones to DB</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Add / Edit Milestone Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {editingMilestone ? (
                  <>
                    <Edit3 className="w-4 h-4 text-primary" />
                    <span>Edit Milestone</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-primary" />
                    <span>Add Learning Milestone / Month</span>
                  </>
                )}
              </h3>
              {editingMilestone && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800"
                >
                  <X className="w-3 h-3" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Period / Timeline Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Month 1 or 2022 — 2025"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Order Index
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Milestone Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Python Core & Algorithmic Problem Solving"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Subtitle / Institution
              </label>
              <input
                type="text"
                placeholder="e.g. Brototype • Algorithmic Foundation"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Badge / Tag Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Core Fundamentals"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value="Code2">Code2 (Python/Coding)</option>
                  <option value="Database">Database (PostgreSQL/SQL)</option>
                  <option value="Server">Server (Django/Backend)</option>
                  <option value="Cloud">Cloud (AWS/DevOps)</option>
                  <option value="GraduationCap">GraduationCap (Degree/B.Com)</option>
                  <option value="Terminal">Terminal (CLI/Linux)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Learned Skills / Topics (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Python 3, OOP, DSA, Clean Code, Git"
                value={formData.skillsInput}
                onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description / Highlights
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of what was achieved and built in this phase..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isCurrent"
                checked={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-700 bg-slate-800"
              />
              <label htmlFor="isCurrent" className="text-xs font-medium text-slate-300 cursor-pointer">
                Currently Active Milestone (highlight with pulse & live badge)
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all text-sm shadow-md shadow-primary/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : editingMilestone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Update Milestone</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Timeline</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Existing Milestones List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-semibold text-slate-300">
              Active Timeline Milestones ({displayList.length})
            </h3>
            <span className="text-xs text-slate-400">Order by Index</span>
          </div>

          <div className="space-y-3">
            {displayList.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`p-4 rounded-xl border transition-all ${
                  item.current
                    ? "bg-primary/5 border-primary/30"
                    : "bg-slate-900/60 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-primary">
                      {item.order || idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-semibold text-primary px-2 py-0.5 rounded bg-primary/10">
                          {item.period}
                        </span>
                        {item.current && (
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            Active
                          </span>
                        )}
                        {item.badge && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                      {item.subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-white/5 transition-colors"
                      title="Edit milestone"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors disabled:opacity-50"
                      title="Delete milestone"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {Array.isArray(item.skills) && item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {item.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
