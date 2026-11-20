import React, { useState, useEffect } from "react";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useToast } from "../../../context/ToastContext";
import { updateMediaSettings } from "../../../firebase/services";
import { ImageUploader } from "../ImageUploader";

export const BackgroundsTab = () => {
  const { settings } = usePortfolio();
  const toast = useToast();

  const [formData, setFormData] = useState({
    bgHero: "",
    bgAbout: "",
    bgJourney: "",
    bgSkills: "",
    bgServices: "",
    bgProjects: "",
    bgContact: "",
    bgGal1: "",
    bgGal2: "",
    bgGal3: "",
    bgGal4: "",
    bgGal5: "",
    bgGal6: "",
    bgGal7: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        bgHero: settings.bgHero || "",
        bgAbout: settings.bgAbout || "",
        bgJourney: settings.bgJourney || "",
        bgSkills: settings.bgSkills || "",
        bgServices: settings.bgServices || "",
        bgProjects: settings.bgProjects || "",
        bgContact: settings.bgContact || "",
        bgGal1: settings.bgGal1 || "",
        bgGal2: settings.bgGal2 || "",
        bgGal3: settings.bgGal3 || "",
        bgGal4: settings.bgGal4 || "",
        bgGal5: settings.bgGal5 || "",
        bgGal6: settings.bgGal6 || "",
        bgGal7: settings.bgGal7 || ""
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const backgrounds = {
        bgHero: formData.bgHero || "",
        bgAbout: formData.bgAbout || "",
        bgJourney: formData.bgJourney || "",
        bgSkills: formData.bgSkills || "",
        bgServices: formData.bgServices || "",
        bgProjects: formData.bgProjects || "",
        bgContact: formData.bgContact || ""
      };

      const gallery = {
        bgGal1: formData.bgGal1 || "",
        bgGal2: formData.bgGal2 || "",
        bgGal3: formData.bgGal3 || "",
        bgGal4: formData.bgGal4 || "",
        bgGal5: formData.bgGal5 || "",
        bgGal6: formData.bgGal6 || "",
        bgGal7: formData.bgGal7 || ""
      };

      await updateMediaSettings({ backgrounds, gallery });
      toast.success("Backgrounds & Gallery images updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save backgrounds: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Backgrounds & Gallery Media</h2>
        <p className="text-sm text-slate-400">
          Upload custom backgrounds for each portfolio section or configure your Life & Work gallery photos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section Backgrounds */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>Section Backgrounds</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              label="Hero Section Background"
              value={formData.bgHero}
              onChange={(url) => setFormData({ ...formData, bgHero: url })}
              folder="backgrounds"
            />
            <ImageUploader
              label="About Section Background"
              value={formData.bgAbout}
              onChange={(url) => setFormData({ ...formData, bgAbout: url })}
              folder="backgrounds"
            />
            <ImageUploader
              label="Journey Section Background"
              value={formData.bgJourney}
              onChange={(url) => setFormData({ ...formData, bgJourney: url })}
              folder="backgrounds"
            />
            <ImageUploader
              label="Skills Section Background"
              value={formData.bgSkills}
              onChange={(url) => setFormData({ ...formData, bgSkills: url })}
              folder="backgrounds"
            />
            <ImageUploader
              label="Services Section Background"
              value={formData.bgServices}
              onChange={(url) => setFormData({ ...formData, bgServices: url })}
              folder="backgrounds"
            />
            <ImageUploader
              label="Projects Section Background"
              value={formData.bgProjects}
              onChange={(url) => setFormData({ ...formData, bgProjects: url })}
              folder="backgrounds"
            />
            <ImageUploader
              label="Contact Section Background"
              value={formData.bgContact}
              onChange={(url) => setFormData({ ...formData, bgContact: url })}
              folder="backgrounds"
            />
          </div>
        </div>

        {/* Life & Work Gallery */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>Life & Work Gallery Photos</span>
          </h3>
          <p className="text-xs text-slate-400">
            Leave blank if you prefer to hide the gallery section on your portfolio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => {
              const key = `bgGal${num}`;
              return (
                <ImageUploader
                  key={key}
                  label={`Gallery Image #${num}`}
                  value={formData[key]}
                  onChange={(url) => setFormData({ ...formData, [key]: url })}
                  folder="gallery"
                />
              );
            })}
          </div>
        </div>

        <div>
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
                <span>Save All Media</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
