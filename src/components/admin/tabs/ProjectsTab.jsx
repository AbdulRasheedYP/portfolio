import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ExternalLink,
  Github,
  Image as ImageIcon
} from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useToast } from "../../../context/ToastContext";
import {
  addProjectDoc,
  updateProjectDoc,
  deleteProjectDoc
} from "../../../firebase/services";
import { Modal } from "../Modal";
import { ImageUploader } from "../ImageUploader";

export const ProjectsTab = () => {
  const { projects } = usePortfolio();
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const initialForm = {
    title: "",
    category: "web",
    description: "",
    longDescription: "",
    techStack: "",
    image: "",
    githubUrl: "",
    liveUrl: "",
    features: "",
    challenges: "",
    images: []
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    const techStr = Array.isArray(project.techStack)
      ? project.techStack.join(", ")
      : project.techStack || "";
    const featStr = Array.isArray(project.features)
      ? project.features.join("\n")
      : project.features || "";

    const loadedImages = Array.isArray(project.images)
      ? project.images.map((img) => {
          if (typeof img === "string") return { url: img, title: "", desc: "" };
          return {
            url: img.url || "",
            title: img.title || "",
            desc: img.desc || ""
          };
        })
      : [];

    setFormData({
      title: project.title || "",
      category: project.category || "web",
      description: project.description || "",
      longDescription: project.longDescription || "",
      techStack: techStr,
      image: project.image || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      features: featStr,
      challenges: project.challenges || "",
      images: loadedImages
    });
    setIsModalOpen(true);
  };

  const handleAddScreenshot = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url: "", title: "", desc: "" }]
    }));
  };

  const handleUpdateScreenshot = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, images: updated };
    });
  };

  const handleRemoveScreenshot = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a project title");
      return;
    }

    setSubmitting(true);

    const techArray = formData.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const featArray = formData.features
      .split("\n")
      .map((f) => f.trim().replace(/^[-*•]\s*/, ""))
      .filter(Boolean);

    const cleanedImages = formData.images
      .filter((img) => img.url && img.url.trim())
      .map((img) => ({
        url: img.url.trim(),
        title: img.title.trim(),
        desc: img.desc.trim()
      }));

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim(),
      longDescription: formData.longDescription.trim() || formData.description.trim(),
      techStack: techArray,
      image: formData.image.trim(),
      githubUrl: formData.githubUrl.trim(),
      liveUrl: formData.liveUrl.trim(),
      features: featArray,
      challenges: formData.challenges.trim(),
      images: cleanedImages
    };

    try {
      if (editingProject) {
        await updateProjectDoc(editingProject.id, payload);
        toast.success(`Project "${payload.title}" updated successfully!`);
      } else {
        await addProjectDoc(payload);
        toast.success(`Project "${payload.title}" created successfully!`);
      }
      setIsModalOpen(false);
      setEditingProject(null);
      setFormData(initialForm);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save project: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete project "${project.title}"?`)) return;

    setDeletingId(project.id);
    try {
      await deleteProjectDoc(project.id);
      toast.success(`Project "${project.title}" deleted.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Projects & Case Studies</h2>
          <p className="text-sm text-slate-400">
            Showcase your best applications, GitHub repositories, and full case study screenshots.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover transition-colors text-sm shadow-md shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => {
          const techList = Array.isArray(p.techStack)
            ? p.techStack
            : (p.techStack || "").split(",").map((t) => t.trim()).filter(Boolean);

          const screenshotCount = Array.isArray(p.images) ? p.images.length : 0;

          return (
            <div
              key={p.id}
              className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-40 bg-slate-900 overflow-hidden">
                  <img
                    src={p.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600"}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600";
                    }}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900/90 text-primary border border-primary/30">
                      {p.category || "web"}
                    </span>
                    {screenshotCount > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>{screenshotCount} screens</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-white mb-1.5">{p.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {techList.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                    {techList.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400 bg-slate-800">
                        +{techList.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 pb-5 pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-primary"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-white/5 transition-colors"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(p)}
                    disabled={deletingId === p.id}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Project"
                  >
                    {deletingId === p.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? `Edit "${editingProject.title}"` : "Add New Project"}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. E-Commerce Platform"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="web">Web Application</option>
                <option value="python">Python / Django</option>
                <option value="frontend">Frontend / React</option>
                <option value="fullstack">Full-Stack</option>
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Short Description (Card Summary)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief 2-line summary shown on the main portfolio card..."
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Detailed Case Study Overview
            </label>
            <textarea
              rows={3}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              placeholder="In-depth explanation of problem statement, architecture, and goals..."
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Tech Stack (Comma-separated)
            </label>
            <input
              type="text"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              placeholder="Python, Django, PostgreSQL, Docker, Tailwind CSS"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Main Cover Image */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span>Project Cover Image (Shown on Homepage Card)</span>
            </h4>
            <ImageUploader
              label="Cover Image URL or File Upload"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              folder="projects/covers"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Live Demo URL (Optional)
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://myproject.vercel.app"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* CASE STUDY SCREENSHOTS BUILDER */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-primary/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span>Case Study Screenshots ({formData.images.length})</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add full-width or walkthrough screenshots shown inside the case study page.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddScreenshot}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black transition-colors text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Screenshot</span>
              </button>
            </div>

            {formData.images.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-white/10 rounded-xl">
                <p className="text-xs text-slate-400 mb-2">
                  No additional screenshots added yet.
                </p>
                <button
                  type="button"
                  onClick={handleAddScreenshot}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Click to add first screenshot</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">
                        Screenshot #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshot(idx)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Screenshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <ImageUploader
                      label="Screenshot Image (Upload or URL)"
                      value={img.url}
                      onChange={(url) => handleUpdateScreenshot(idx, "url", url)}
                      folder="projects/screenshots"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Caption / Title (Optional)
                        </label>
                        <input
                          type="text"
                          value={img.title || ""}
                          onChange={(e) => handleUpdateScreenshot(idx, "title", e.target.value)}
                          placeholder="e.g. Dashboard Overview"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Short Explanation (Optional)
                        </label>
                        <input
                          type="text"
                          value={img.desc || ""}
                          onChange={(e) => handleUpdateScreenshot(idx, "desc", e.target.value)}
                          placeholder="e.g. User analytics view"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Key Features (One feature per line)
            </label>
            <textarea
              rows={3}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="User authentication with JWT&#10;Stripe payment gateway integration&#10;Real-time WebSocket chat notifications"
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary font-mono text-xs"
            />
          </div>

          {/* Challenges */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Technical Challenges & Solutions
            </label>
            <textarea
              rows={2}
              value={formData.challenges}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
              placeholder="Explain how you solved challenging database bottlenecks or race conditions..."
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all text-sm shadow-md shadow-primary/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingProject ? "Update Project" : "Create Project"}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
