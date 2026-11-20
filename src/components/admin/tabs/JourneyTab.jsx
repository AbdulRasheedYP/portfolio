import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Loader2,
  X,
  Milestone,
  CheckCircle2,
  Layers,
  GraduationCap,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useToast } from "../../../context/ToastContext";
import {
  addJourneyDoc,
  updateJourneyDoc,
  deleteJourneyDoc
} from "../../../firebase/services";
import {
  FALLBACK_JOURNEY,
  DEFAULT_BROTOTYPE_SPRINTS
} from "../../../constants/fallbackData";

export const JourneyTab = () => {
  const { journey = [] } = usePortfolio();
  const toast = useToast();

  const [activeSubTab, setActiveSubTab] = useState("sprints"); // "sprints" or "overview"

  // Sprint Form State (Brototype Month-by-Month)
  const [sprintForm, setSprintForm] = useState({
    period: "",
    title: "",
    description: "",
    skillsInput: "",
    order: 1,
    current: false
  });
  const [editingSprint, setEditingSprint] = useState(null);
  const [submittingSprint, setSubmittingSprint] = useState(false);
  const [deletingSprintId, setDeletingSprintId] = useState(null);

  // Main Milestone Form State (B.Com / Brototype Overview)
  const [overviewForm, setOverviewForm] = useState({
    period: "",
    title: "",
    subtitle: "",
    badge: "",
    description: "",
    skillsInput: ""
  });
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [submittingOverview, setSubmittingOverview] = useState(false);

  const [seeding, setSeeding] = useState(false);

  // Extract Sprints and Milestones
  const sprintDocs = Array.isArray(journey) ? journey.filter((j) => j.type === "sprint") : [];
  const activeSprints = sprintDocs.length > 0
    ? [...sprintDocs].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    : DEFAULT_BROTOTYPE_SPRINTS;

  const academicDoc = Array.isArray(journey)
    ? journey.find((j) => j.type === "academic") || FALLBACK_JOURNEY[0]
    : FALLBACK_JOURNEY[0];

  const brototypeDoc = Array.isArray(journey)
    ? journey.find((j) => j.type === "tech" && j.id !== "j-bcom") || FALLBACK_JOURNEY[1]
    : FALLBACK_JOURNEY[1];

  // --- Sprint Handlers ---
  const handleStartEditSprint = (item) => {
    setEditingSprint(item);
    setSprintForm({
      period: item.period || "",
      title: item.title || "",
      description: item.description || "",
      skillsInput: Array.isArray(item.skills) ? item.skills.join(", ") : "",
      order: item.order || 1,
      current: Boolean(item.current)
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelSprintEdit = () => {
    setEditingSprint(null);
    setSprintForm({
      period: "",
      title: "",
      description: "",
      skillsInput: "",
      order: activeSprints.length + 1,
      current: false
    });
  };

  const handleSaveSprint = async (e) => {
    e.preventDefault();
    if (!sprintForm.title.trim() || !sprintForm.period.trim()) {
      toast.error("Please enter a Title and Period (e.g. 'Month 1')");
      return;
    }

    const skills = sprintForm.skillsInput
      ? sprintForm.skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      period: sprintForm.period.trim(),
      title: sprintForm.title.trim(),
      description: sprintForm.description.trim(),
      skills,
      order: Number(sprintForm.order) || 1,
      current: Boolean(sprintForm.current),
      type: "sprint"
    };

    setSubmittingSprint(true);
    try {
      if (editingSprint && editingSprint.id && !editingSprint.id.startsWith("sp-")) {
        // Existing Firestore Document
        await updateJourneyDoc(editingSprint.id, payload);
        toast.success(`Updated "${sprintForm.period}: ${sprintForm.title}"!`);
      } else {
        // New Document or saving a modified default sprint
        await addJourneyDoc(payload);
        toast.success(`Saved "${sprintForm.period}: ${sprintForm.title}" to Firebase!`);
      }
      handleCancelSprintEdit();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save sprint: " + err.message);
    } finally {
      setSubmittingSprint(false);
    }
  };

  const handleDeleteSprint = async (item) => {
    if (!window.confirm(`Delete "${item.period}: ${item.title}" from timeline?`)) return;

    if (!item.id || item.id.startsWith("sp-")) {
      toast.info("This is a built-in default item. Save any custom sprint to start overriding defaults.");
      return;
    }

    setDeletingSprintId(item.id);
    try {
      await deleteJourneyDoc(item.id);
      if (editingSprint && editingSprint.id === item.id) {
        handleCancelSprintEdit();
      }
      toast.success(`Deleted "${item.period}"`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete: " + err.message);
    } finally {
      setDeletingSprintId(null);
    }
  };

  // --- Seed All Defaults to Firestore ---
  const handleSeedDefaults = async () => {
    if (!window.confirm("Initialize Firebase with all default milestones and sprints?")) return;
    setSeeding(true);
    try {
      // 1. Seed B.Com
      const { id: _bId, ...academicPayload } = FALLBACK_JOURNEY[0];
      await addJourneyDoc(academicPayload);

      // 2. Seed Brototype Overview
      const { id: _brId, sprints: _sp, ...brototypePayload } = FALLBACK_JOURNEY[1];
      await addJourneyDoc(brototypePayload);

      // 3. Seed all 4 Sprints
      for (const sp of DEFAULT_BROTOTYPE_SPRINTS) {
        const { id: _sId, ...sprintPayload } = sp;
        await addJourneyDoc(sprintPayload);
      }

      toast.success("All default Journey milestones & monthly sprints saved to Firebase!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to seed: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  // --- Overview Milestones Handlers ---
  const handleStartEditOverview = (milestone) => {
    setEditingMilestone(milestone);
    setOverviewForm({
      period: milestone.period || "",
      title: milestone.title || "",
      subtitle: milestone.subtitle || "",
      badge: milestone.badge || "",
      description: milestone.description || "",
      skillsInput: Array.isArray(milestone.skills) ? milestone.skills.join(", ") : ""
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleSaveOverview = async (e) => {
    e.preventDefault();
    if (!editingMilestone) return;

    const skills = overviewForm.skillsInput
      ? overviewForm.skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      period: overviewForm.period.trim(),
      title: overviewForm.title.trim(),
      subtitle: overviewForm.subtitle.trim(),
      badge: overviewForm.badge.trim(),
      description: overviewForm.description.trim(),
      skills,
      type: editingMilestone.type,
      order: editingMilestone.order || 1,
      current: Boolean(editingMilestone.current)
    };

    setSubmittingOverview(true);
    try {
      if (editingMilestone.id && !editingMilestone.id.startsWith("j-")) {
        await updateJourneyDoc(editingMilestone.id, payload);
        toast.success(`Updated "${overviewForm.title}"!`);
      } else {
        await addJourneyDoc(payload);
        toast.success(`Saved "${overviewForm.title}" to Firebase!`);
      }
      setEditingMilestone(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save: " + err.message);
    } finally {
      setSubmittingOverview(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Milestone className="w-5 h-5 text-primary" />
            <span>My Journey & Learning Timeline</span>
          </h2>
          <p className="text-sm text-slate-400">
            Add and edit your month-by-month Brototype curriculum and career milestones.
          </p>
        </div>

        {sprintDocs.length === 0 && (
          <button
            type="button"
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all self-start sm:self-auto"
          >
            {seeding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Sync Default Sprints to DB</span>
          </button>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab("sprints")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeSubTab === "sprints"
              ? "bg-primary text-black shadow-md shadow-primary/20"
              : "bg-slate-800/80 text-slate-300 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Brototype Monthly Sprints ({activeSprints.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeSubTab === "overview"
              ? "bg-primary text-black shadow-md shadow-primary/20"
              : "bg-slate-800/80 text-slate-300 hover:text-white"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Main Milestones (B.Com & Overview)</span>
        </button>
      </div>

      {/* TAB 1: BROTOTYPE MONTH-BY-MONTH SPRINTS */}
      {activeSubTab === "sprints" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSaveSprint} className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {editingSprint ? (
                    <>
                      <Edit3 className="w-4 h-4 text-primary" />
                      <span>Edit Sprint ({sprintForm.period || "Month"})</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-primary" />
                      <span>Add New Month Sprint</span>
                    </>
                  )}
                </h3>
                {editingSprint && (
                  <button
                    type="button"
                    onClick={handleCancelSprintEdit}
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
                    Sprint / Month Label *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Month 1, Month 5..."
                    value={sprintForm.period}
                    onChange={(e) => setSprintForm({ ...sprintForm, period: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Timeline Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sprintForm.order}
                    onChange={(e) => setSprintForm({ ...sprintForm, order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Topic / Language Learned *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Django Framework & RESTful APIs"
                  value={sprintForm.title}
                  onChange={(e) => setSprintForm({ ...sprintForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Skills / Tech Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, Django, REST APIs, JWT, ORM"
                  value={sprintForm.skillsInput}
                  onChange={(e) => setSprintForm({ ...sprintForm, skillsInput: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description / Focus
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of projects, architecture, or topics covered..."
                  value={sprintForm.description}
                  onChange={(e) => setSprintForm({ ...sprintForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="sprintCurrent"
                  checked={sprintForm.current}
                  onChange={(e) => setSprintForm({ ...sprintForm, current: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-700 bg-slate-800"
                />
                <label htmlFor="sprintCurrent" className="text-xs font-medium text-slate-300 cursor-pointer">
                  Currently Active / In Progress (shows green pulse dot)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingSprint}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all text-sm shadow-md shadow-primary/20"
                >
                  {submittingSprint ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : editingSprint ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Update Sprint</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add Sprint to Timeline</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-semibold text-slate-300">
                Timeline Sprints Track ({activeSprints.length})
              </h3>
              <span className="text-xs text-slate-400">Order by Index</span>
            </div>

            <div className="space-y-3">
              {activeSprints.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`p-4 rounded-xl border transition-all ${
                    item.current
                      ? "bg-emerald-500/5 border-emerald-500/30"
                      : "bg-slate-900/60 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-primary">
                        {item.order || idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                            {item.period}
                          </span>
                          {item.current && (
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                              Active / In Progress
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleStartEditSprint(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-white/5 transition-colors"
                        title="Edit sprint"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSprint(item)}
                        disabled={deletingSprintId === item.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors disabled:opacity-50"
                        title="Delete sprint"
                      >
                        {deletingSprintId === item.id ? (
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
      )}

      {/* TAB 2: MAIN MILESTONES (B.COM & BROTOTYPE OVERVIEW) */}
      {activeSubTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Edit Milestone */}
          <div className="lg:col-span-6">
            {editingMilestone ? (
              <form onSubmit={handleSaveOverview} className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-primary" />
                    <span>Edit Milestone: {editingMilestone.title}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingMilestone(null)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Period Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={overviewForm.period}
                    onChange={(e) => setOverviewForm({ ...overviewForm, period: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={overviewForm.title}
                    onChange={(e) => setOverviewForm({ ...overviewForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Subtitle / Institution
                  </label>
                  <input
                    type="text"
                    value={overviewForm.subtitle}
                    onChange={(e) => setOverviewForm({ ...overviewForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={overviewForm.skillsInput}
                    onChange={(e) => setOverviewForm({ ...overviewForm, skillsInput: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={overviewForm.description}
                    onChange={(e) => setOverviewForm({ ...overviewForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingOverview}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all text-sm shadow-md shadow-primary/20"
                >
                  {submittingOverview ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center h-64 text-slate-400">
                <Edit3 className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-300">
                  Select a milestone from the right to edit its details
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  You can edit your B.Com degree info or Brototype trainee overview.
                </p>
              </div>
            )}
          </div>

          {/* Right: Cards */}
          <div className="lg:col-span-6 space-y-4">
            {/* Academic Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary px-2.5 py-0.5 rounded bg-primary/10">
                  {academicDoc.period}
                </span>
                <button
                  type="button"
                  onClick={() => handleStartEditOverview(academicDoc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-primary bg-white/5 hover:bg-primary/10 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Academic Info</span>
                </button>
              </div>
              <h4 className="text-base font-bold text-white">{academicDoc.title}</h4>
              <p className="text-xs text-slate-400">{academicDoc.subtitle}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{academicDoc.description}</p>
            </div>

            {/* Brototype Card */}
            <div className="glass-panel p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary px-2.5 py-0.5 rounded bg-primary/10">
                  {brototypeDoc.period}
                </span>
                <button
                  type="button"
                  onClick={() => handleStartEditOverview(brototypeDoc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-primary bg-white/5 hover:bg-primary/10 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Tech Overview</span>
                </button>
              </div>
              <h4 className="text-base font-bold text-white">{brototypeDoc.title}</h4>
              <p className="text-xs text-slate-400">{brototypeDoc.subtitle}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{brototypeDoc.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
