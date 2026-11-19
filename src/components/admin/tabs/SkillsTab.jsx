import React, { useState } from "react";
import { Plus, Trash2, Loader2, Sparkles } from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useToast } from "../../../context/ToastContext";
import { addSkillDoc, deleteSkillDoc } from "../../../firebase/services";
import { DynamicIcon } from "../../common/DynamicIcon";

export const SkillsTab = () => {
  const { skills } = usePortfolio();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    icon: "Code2",
    color: "#00d9ff",
    order: skills.length + 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const iconOptions = [
    { label: "Code", value: "Code2" },
    { label: "Server", value: "Server" },
    { label: "Database", value: "Database" },
    { label: "Globe (Web)", value: "Globe" },
    { label: "File / Script", value: "FileCode2" },
    { label: "Cpu", value: "Cpu" },
    { label: "Palette", value: "Palette" },
    { label: "Git", value: "GitBranch" },
    { label: "Layers", value: "Layers" },
    { label: "Terminal", value: "Terminal" }
  ];

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a skill name");
      return;
    }

    setSubmitting(true);
    try {
      await addSkillDoc({
        name: formData.name.trim(),
        icon: formData.icon,
        color: formData.color,
        order: Number(formData.order) || 99
      });
      toast.success(`Skill "${formData.name.trim()}" added!`);
      setFormData({
        name: "",
        icon: "Code2",
        color: "#00d9ff",
        order: skills.length + 2
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add skill: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skill) => {
    if (!window.confirm(`Are you sure you want to delete "${skill.name}"?`)) return;

    setDeletingId(skill.id);
    try {
      await deleteSkillDoc(skill.id);
      toast.success(`Skill "${skill.name}" deleted`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete skill: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Manage Technical Skills</h2>
        <p className="text-sm text-slate-400">
          Add, reorder, or remove technologies and tools displayed on your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Add Skill Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleAddSkill} className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              <span>Add New Skill</span>
            </h3>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Skill Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. FastAPI, Docker, Redis"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Icon
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-white/10">
                  <DynamicIcon name={formData.icon} color={formData.color} className="w-5 h-5" />
                  <span className="text-xs text-slate-400">Preview</span>
                </div>
              </div>
            </div>

            {/* Color & Order */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Color (Hex)
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
                {/* Quick Presets matching legacy admin */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-slate-400">Presets:</span>
                  {[
                    { color: "#ef4444", title: "Red" },
                    { color: "#3b82f6", title: "Blue" },
                    { color: "#00d9ff", title: "Cyan" },
                    { color: "#10b981", title: "Green" },
                    { color: "#f59e0b", title: "Yellow" },
                    { color: "#8b5cf6", title: "Purple" },
                    { color: "#ffffff", title: "White" }
                  ].map((p) => (
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
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all text-sm mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Skills List */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white mb-4">
              Current Skills ({skills.length})
            </h3>

            {skills.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">
                No skills configured yet. Add your first skill using the form.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center"
                        style={{ color: skill.color || "#00d9ff" }}
                      >
                        <DynamicIcon name={skill.icon} className="w-4 h-4" color={skill.color} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white block">
                          {skill.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Order: {skill.order || "-"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSkill(skill)}
                      disabled={deletingId === skill.id}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Skill"
                    >
                      {deletingId === skill.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
