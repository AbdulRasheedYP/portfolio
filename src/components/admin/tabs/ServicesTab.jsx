import React, { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useToast } from "../../../context/ToastContext";
import { addServiceDoc, deleteServiceDoc } from "../../../firebase/services";
import { DynamicIcon } from "../../common/DynamicIcon";

export const ServicesTab = () => {
  const { services } = usePortfolio();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Server"
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const iconOptions = [
    { label: "Server (Backend)", value: "Server" },
    { label: "Globe (Web Apps)", value: "Globe" },
    { label: "Database (Data Arch)", value: "Database" },
    { label: "Cpu (APIs & Microservices)", value: "Cpu" },
    { label: "Code (Programming)", value: "Code2" },
    { label: "Layout (Frontend)", value: "Layout" }
  ];

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in both title and description");
      return;
    }

    setSubmitting(true);
    try {
      await addServiceDoc({
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon: formData.icon
      });
      toast.success(`Service "${formData.title.trim()}" added!`);
      setFormData({ title: "", description: "", icon: "Server" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add service: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (service) => {
    if (!window.confirm(`Are you sure you want to delete "${service.title}"?`)) return;

    setDeletingId(service.id);
    try {
      await deleteServiceDoc(service.id);
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
          Offerings and technical capabilities displayed in your services section.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Add Service Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleAddService} className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              <span>Add New Service</span>
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Service Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Backend Development"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Service Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what you provide for clients and employers..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary resize-none"
              />
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
                  <span>Add Service</span>
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
                No services configured yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-white/5 flex items-start justify-between gap-4 group hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 text-primary shrink-0 mt-0.5">
                        <DynamicIcon name={srv.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{srv.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteService(srv)}
                      disabled={deletingId === srv.id}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                      title="Delete Service"
                    >
                      {deletingId === srv.id ? (
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
