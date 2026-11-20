import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useToast } from "../../../context/ToastContext";
import { updateGeneralSettings } from "../../../firebase/services";
import { ImageUploader } from "../ImageUploader";

export const AboutTab = () => {
  const { settings } = usePortfolio();
  const toast = useToast();

  const [formData, setFormData] = useState({
    about: "",
    resumeUrl: "",
    location: "",
    phone: "",
    email: "",
    freelanceState: "available"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        about: settings.about || "",
        resumeUrl: settings.resumeUrl || "",
        location: settings.location || "",
        phone: settings.phone || "",
        email: settings.email || "",
        freelanceState: settings.freelanceState || "available"
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateGeneralSettings(formData);
      toast.success("About & Contact settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save about settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">About & Personal Details</h2>
        <p className="text-sm text-slate-400">
          Update your biography, resume download link, location, and freelance availability status.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-5">
        {/* About Bio */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            About Me Biography (Markdown / Multiline)
          </label>
          <textarea
            rows={6}
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            placeholder="Write your story, education track, and career objectives..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Resume CV File / URL */}
        <ImageUploader
          label="Resume / CV File or Link (PDF / Image)"
          value={formData.resumeUrl}
          onChange={(url) => setFormData({ ...formData, resumeUrl: url })}
          folder="resumes"
          accept="application/pdf,image/*,.pdf"
        />

        {/* Quick Presets for local CV */}
        <div className="flex flex-wrap items-center gap-2 -mt-2">
          <span className="text-[11px] text-slate-400">Quick link local CV:</span>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, resumeUrl: "/img/AbdulrasheedCV.pdf" })}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-primary border border-white/10 text-xs transition-colors"
          >
            Default CV
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, resumeUrl: "/img/AbdulRasheedCV_new.pdf" })}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-primary border border-white/10 text-xs transition-colors"
          >
            New CV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Malappuram, Kerala, India"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +91 9778106863"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. abdulrasheed5140@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Freelance Availability */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Freelance & Work Availability
            </label>
            <select
              value={formData.freelanceState}
              onChange={(e) => setFormData({ ...formData, freelanceState: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
            >
              <option value="available">🟢 Available for freelance work</option>
              <option value="not_available">🔴 Not available for freelance</option>
              <option value="hidden">⚪ Hidden (do not display badge)</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-white/10">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all text-sm shadow-md shadow-primary/20"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save About Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
