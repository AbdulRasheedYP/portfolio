import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Loader2, GripVertical, Check, X } from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useToast } from "../../../context/ToastContext";
import {
  addSkillDoc,
  updateSkillDoc,
  updateSkillsOrder,
  deleteSkillDoc
} from "../../../firebase/services";
import { sanitizeIcon } from "../../../utils/iconUtils";

export const SkillsTab = () => {
  const { skills } = usePortfolio();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    icon: "fab fa-python",
    color: "#3776AB",
    order: ""
  });
  const [editingSkill, setEditingSkill] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Local skills state for smooth drag-and-drop
  const [localSkills, setLocalSkills] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  useEffect(() => {
    // Keep local skills sorted by order
    const sorted = [...skills].sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
    setLocalSkills(sorted);
  }, [skills]);

  const presetColors = [
    { color: "#ef4444", title: "Red" },
    { color: "#3b82f6", title: "Blue" },
    { color: "#00d9ff", title: "Cyan" },
    { color: "#10b981", title: "Green" },
    { color: "#f59e0b", title: "Yellow" },
    { color: "#8b5cf6", title: "Purple" },
    { color: "#ffffff", title: "White" }
  ];

  const handleStartEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || "",
      icon: skill.icon || "fas fa-code",
      color: skill.color || "#00d9ff",
      order: skill.order !== undefined && skill.order !== null ? skill.order : ""
    });
    // Scroll smoothly to form
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      icon: "fab fa-python",
      color: "#3776AB",
      order: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a skill name");
      return;
    }

    const cleanIcon = sanitizeIcon(formData.icon) || "fas fa-code";

    setSubmitting(true);
    try {
      if (editingSkill) {
        // Update existing skill
        await updateSkillDoc(editingSkill.id, {
          name: formData.name.trim(),
          icon: cleanIcon,
          color: formData.color,
          order: formData.order !== "" ? Number(formData.order) : (editingSkill.order || 99)
        });
        toast.success(`Skill "${formData.name.trim()}" updated!`);
        handleCancelEdit();
      } else {
        // Add new skill
        const nextOrder =
          formData.order !== ""
            ? Number(formData.order)
            : (localSkills.length > 0
                ? Math.max(...localSkills.map((s) => Number(s.order) || 0)) + 1
                : 1);

        await addSkillDoc({
          name: formData.name.trim(),
          icon: cleanIcon,
          color: formData.color,
          order: nextOrder
        });
        toast.success(`Skill "${formData.name.trim()}" added!`);
        setFormData({
          name: "",
          icon: "fab fa-python",
          color: "#3776AB",
          order: ""
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save skill: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skill) => {
    if (!window.confirm(`Are you sure you want to delete "${skill.name}"?`)) return;

    setDeletingId(skill.id);
    try {
      await deleteSkillDoc(skill.id);
      if (editingSkill && editingSkill.id === skill.id) {
        handleCancelEdit();
      }
      toast.success(`Skill "${skill.name}" deleted`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete skill: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDragLeave = () => {
    // optional reset on leave
  };

  const handleDrop = async (e, dropIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const reordered = [...localSkills];
    const [moved] = reordered.splice(draggedIdx, 1);
    reordered.splice(dropIdx, 0, moved);

    // Immediately update local UI
    setLocalSkills(reordered);
    setDraggedIdx(null);
    setDragOverIdx(null);

    // Save batch update to Firestore
    setIsSavingOrder(true);
    try {
      await updateSkillsOrder(reordered);
      toast.success("Skill order saved!");
    } catch (err) {
      console.error("Order update error:", err);
      toast.error("Failed to save reordered skills: " + err.message);
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Technical Skills</h2>
          <p className="text-sm text-slate-400">
            Type FontAwesome icons or paste <code>&lt;i&gt;</code> code, customize brand colors, and drag with mouse to reorder.
          </p>
        </div>
        {isSavingOrder && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-semibold animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Saving new order...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Add / Edit Skill Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {editingSkill ? (
                  <>
                    <Edit3 className="w-4 h-4 text-primary" />
                    <span>Edit Skill: {editingSkill.name}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-primary" />
                    <span>Add New Skill</span>
                  </>
                )}
              </h3>
              {editingSkill && (
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

            {/* Skill Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Skill Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Python, Docker, PostgreSQL"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* FontAwesome Icon Class / <i> input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                FontAwesome Icon Class or &lt;i&gt; Code *
              </label>
              <input
                type="text"
                required
                value={formData.icon}
                onChange={(e) => {
                  const sanitized = sanitizeIcon(e.target.value);
                  setFormData({ ...formData, icon: sanitized });
                }}
                placeholder="e.g. fab fa-python or <i class='fab fa-python'></i>"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-primary"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Paste <code className="text-primary font-mono">&lt;i class="..."&gt;</code> or class value — e.g. <code className="text-emerald-400 font-mono">fab fa-react</code>, <code className="text-emerald-400 font-mono">fa-brands fa-docker</code>, <code className="text-emerald-400 font-mono">fas fa-database</code>. Find icons at{" "}
                <a
                  href="https://fontawesome.com/icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-white"
                >
                  fontawesome.com/icons
                </a>
              </p>
            </div>

            {/* Live Preview Box */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Live Icon Preview
              </label>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/90 border border-white/10">
                <div
                  className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/5"
                  style={{ color: formData.color || "#00d9ff" }}
                >
                  <i className={formData.icon || "fas fa-code"} style={{ fontSize: "1.85rem" }}></i>
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Live Preview</div>
                  <div className="text-base font-bold text-white truncate">{formData.name || "Skill Name"}</div>
                  <div className="text-xs text-primary font-mono truncate">{formData.icon || "fas fa-code"}</div>
                </div>
              </div>
            </div>

            {/* Brand Color & Order */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Brand Color *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-slate-400">Presets:</span>
                  {presetColors.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: p.color })}
                      style={{ backgroundColor: p.color }}
                      className="w-4 h-4 rounded-full border border-black/30 hover:scale-125 transition-transform"
                      title={p.title}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  placeholder="Auto (end)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Drag below or enter number
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all text-sm mt-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{editingSkill ? "Updating..." : "Saving..."}</span>
                </>
              ) : editingSkill ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Skill</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Save Skill</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Skills List with Mouse Drag-and-Drop */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white">
                Existing Skills ({localSkills.length})
              </h3>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <GripVertical className="w-3.5 h-3.5 text-primary" />
                <span>Drag handle to reorder</span>
              </span>
            </div>

            {localSkills.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">
                No skills configured yet. Add your first skill using the form.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {localSkills.map((skill, index) => {
                  const isDragging = draggedIdx === index;
                  const isOver = dragOverIdx === index;

                  return (
                    <div
                      key={skill.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`p-3 rounded-xl bg-slate-900/90 border transition-all flex items-center justify-between gap-3 group ${
                        isDragging
                          ? "opacity-40 scale-[0.98] border-dashed border-primary"
                          : isOver
                          ? "border-primary bg-primary/10 shadow-lg scale-[1.01]"
                          : "border-white/5 hover:border-white/20"
                      }`}
                    >
                      {/* Left: Drag handle + Index + Icon + Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Drag Handle */}
                        <div
                          className="cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-primary transition-colors shrink-0"
                          title="Click & drag to reorder"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Order number badge */}
                        <span className="text-[11px] font-mono text-slate-500 w-5 shrink-0">
                          #{index + 1}
                        </span>

                        {/* Icon */}
                        <div
                          className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-white/5"
                          style={{ color: skill.color || "#00d9ff" }}
                        >
                          <i className={skill.icon || "fas fa-code"} style={{ fontSize: "1.2rem" }}></i>
                        </div>

                        {/* Text */}
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-white block truncate">
                            {skill.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block truncate">
                            {skill.icon || "fas fa-code"}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(skill)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit Skill"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(skill)}
                          disabled={deletingId === skill.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Skill"
                        >
                          {deletingId === skill.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
