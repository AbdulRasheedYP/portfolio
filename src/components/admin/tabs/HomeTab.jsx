import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useToast } from "../../../context/ToastContext";
import { updateGeneralSettings } from "../../../firebase/services";
import { ImageUploader } from "../ImageUploader";

export const HomeTab = () => {
  const { settings } = usePortfolio();
  const toast = useToast();

  const [formData, setFormData] = useState({
    subtitle: "",
    name: "",
    roles: "",
    heroDesc: "",
    profileImg: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        subtitle: settings.subtitle || "",
        name: settings.name || "",
        roles: settings.roles || "",
        heroDesc: settings.heroDesc || "",
        profileImg: settings.profileImg || ""
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateGeneralSettings(formData);
      toast.success("Home hero settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save home settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Hero & Header Settings</h2>
        <p className="text-sm text-slate-400">
          Configure the primary headline, animated typing roles, and hero presentation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-5">
        {/* Subtitle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Subtitle Badge
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="e.g. Hello, I'm"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Abdul Rasheed YP"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Roles */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Animated Typing Roles (Comma separated)
          </label>
          <input
            type="text"
            value={formData.roles}
            onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
            placeholder="Python Full-Stack Developer, Django Specialist, Backend Engineer"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-slate-500 mt-1">
            Separate roles with commas. These will cycle in the animated hero typewriter.
          </p>
        </div>

        {/* Hero Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Hero Description
          </label>
          <textarea
            rows={3}
            value={formData.heroDesc}
            onChange={(e) => setFormData({ ...formData, heroDesc: e.target.value })}
            placeholder="I build scalable and user-friendly web applications..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Profile Image */}
        <ImageUploader
          label="Profile Picture URL or Upload"
          value={formData.profileImg}
          onChange={(url) => setFormData({ ...formData, profileImg: url })}
          folder="avatars"
        />

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
                <span>Save Home Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
