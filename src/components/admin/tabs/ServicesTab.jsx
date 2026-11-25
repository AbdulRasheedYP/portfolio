import React, { useState } from "react";
import { Plus, Trash2, Edit3, Loader2, Check, X } from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useToast } from "../../../context/ToastContext";
import {
  addServiceDoc,
  updateServiceDoc,
  deleteServiceDoc
} from "../../../firebase/services";
import { sanitizeIcon } from "../../../utils/iconUtils";

export const ServicesTab = () => {
  const { services, setServices } = usePortfolio();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "fas fa-laptop-code"
  });
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleStartEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "fas fa-laptop-code"
    });
    // Scroll smoothly to form
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      icon: "fas fa-laptop-code"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in both title and description");
      return;
    }

    const cleanIcon = sanitizeIcon(formData.icon) || "fas fa-code";

    setSubmitting(true);
    try {
      if (editingService) {
        // Update existing service
        const targetId = editingService.firestoreId || editingService.id;
        await updateServiceDoc(targetId, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          icon: cleanIcon
        });
        toast.success(`Service "${formData.title.trim()}" updated!`);
        handleCancelEdit();
      } else {
        // Add new service
        await addServiceDoc({
          title: formData.title.trim(),
          description: formData.description.trim(),
          icon: cleanIcon
        });
        toast.success(`Service "${formData.title.trim()}" added!`);
        setFormData({
          title: "",
          description: "",
          icon: "fas fa-laptop-code"
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save service: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (service) => {
    if (!window.confirm(`Are you sure you want to delete "${service.title}"?`)) return;

    const targetId = service.firestoreId || service.id;
    setDeletingId(targetId);
    try {
      if (setServices) {
        setServices((prev) => prev.filter((s) => (s.firestoreId || s.id) !== targetId));
      }
      await deleteServiceDoc(targetId);
      if (editingService && (editingService.firestoreId || editingService.id) === targetId) {
        handleCancelEdit();
      }
      toast.success(`Service "${service.title}" deleted`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Manage Services</h2>
        <p className="text-sm text-slate-400">
          Add, edit, or remove technical service offerings displayed on your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Add / Edit Service Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {editingService ? (
                  <>
                    <Edit3 className="w-4 h-4 text-primary" />
                    <span>Edit Service</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-primary" />
                    <span>Add New Service</span>
                  </>
                )}
              </h3>
              {editingService && (
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

            {/* Service Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Service Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Backend Development, DevOps & Deployment"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* FontAwesome Icon Class / <i> code */}
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
                placeholder="e.g. fas fa-server or <i class='fas fa-server'></i>"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-primary"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Paste <code className="text-primary font-mono">&lt;i class="..."&gt;</code> or class value — e.g. <code className="text-emerald-400 font-mono">fas fa-laptop-code</code>, <code className="text-emerald-400 font-mono">fas fa-server</code>, <code className="text-emerald-400 font-mono">fas fa-shopping-cart</code>. Find icons at{" "}
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

            {/* Live Icon Preview */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Live Icon Preview
              </label>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/90 border border-white/10">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  <i className={formData.icon || "fas fa-code"} style={{ fontSize: "1.85rem" }}></i>
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Live Preview</div>
                  <div className="text-base font-bold text-white truncate">{formData.title || "Service Title"}</div>
                  <div className="text-xs text-primary font-mono truncate">{formData.icon || "fas fa-code"}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Service Description *
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what you provide for clients and employers..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all text-sm mt-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{editingService ? "Updating..." : "Saving..."}</span>
                </>
              ) : editingService ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Service</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Save Service</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Services List */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-white mb-4">
              Current Services ({services.length})
            </h3>

            {services.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">
                No services configured yet. Add your first service using the form.
              </p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-white/5 flex items-start justify-between gap-4 group hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-white/5 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <i className={srv.icon || "fas fa-code"} style={{ fontSize: "1.2rem" }}></i>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white">{srv.title}</h4>
                        <span className="text-[10px] font-mono text-primary/80 block mt-0.5">
                          {srv.icon || "fas fa-code"}
                        </span>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(srv)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Edit Service"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(srv)}
                        disabled={deletingId === srv.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Service"
                      >
                        {deletingId === srv.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
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
