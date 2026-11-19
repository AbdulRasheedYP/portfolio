import React, { useState } from "react";
import { UploadCloud, Check, AlertCircle, Loader2 } from "lucide-react";
import { uploadFileToStorage } from "../../firebase/services";

export const ImageUploader = ({ value, onChange, folder = "portfolio", label = "Image URL or Upload" }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    setProgress(0);

    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const storagePath = `${folder}/${safeName}`;

    try {
      const url = await uploadFileToStorage(file, storagePath, (pct) => {
        setProgress(pct);
      });
      onChange(url);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please check Firebase Storage rules or internet connection.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Direct URL input */}
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste URL (e.g. https://... or /img/...)"
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
        />

        {/* Upload Button */}
        <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-sm font-medium transition-colors shrink-0">
          <UploadCloud className="w-4 h-4 text-primary" />
          <span>Upload File</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-1 mt-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
              Uploading to Firebase Storage...
            </span>
            <span className="font-semibold text-primary">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Thumbnail */}
      {value && (
        <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-white/5 w-fit">
          <img
            src={value}
            alt="Preview"
            className="w-12 h-12 object-cover rounded-lg bg-slate-900"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="text-xs text-slate-400 max-w-xs truncate">
            {value}
          </span>
        </div>
      )}
    </div>
  );
};
