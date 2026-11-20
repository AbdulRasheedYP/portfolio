import React, { useState } from "react";
import {
  UploadCloud,
  Check,
  AlertCircle,
  Loader2,
  FileText,
  ExternalLink,
  Trash2,
  Crop as CropIcon
} from "lucide-react";
import { uploadFileToStorage } from "../../firebase/services";
import { ImageCropModal } from "./ImageCropModal";

export const ImageUploader = ({
  value,
  onChange,
  folder = "portfolio",
  label = "Image URL or Upload",
  accept = "image/*",
  allowCrop = true,
  aspectRatio = null
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // Crop Modal States
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);

  const doUpload = async (fileOrBlob, customFileName) => {
    setError("");
    setUploading(true);
    setProgress(0);

    const originalName =
      customFileName ||
      (fileOrBlob instanceof File ? fileOrBlob.name : "image.jpg");
    const safeName = `${Date.now()}_${originalName.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const storagePath = `${folder}/${safeName}`;

    try {
      const url = await uploadFileToStorage(fileOrBlob, storagePath, (pct) => {
        setProgress(pct);
      });
      onChange(url);
    } catch (err) {
      console.error("Upload error:", err);
      const isAuthError =
        err.code === "storage/unauthorized" ||
        err.message?.includes("unauthorized");
      const isNetworkOrAdblock =
        err.message?.includes("Failed to fetch") ||
        (err.name === "TypeError" && !err.code);

      let errorMsg;
      if (isAuthError) {
        errorMsg =
          "Permission Denied (storage/unauthorized): Firebase Storage rules in Firebase Console are blocking upload.";
      } else if (isNetworkOrAdblock) {
        errorMsg =
          "Connection Blocked: If you are using Brave Browser or an Ad-Blocker, please disable Shields/Ad-Blocker for this site.";
      } else {
        errorMsg = err.code
          ? `[${err.code}]: ${err.message}`
          : err.message || "Failed to upload file.";
      }
      setError(errorMsg);
    } finally {
      setUploading(false);
      setPendingFile(null);
      if (cropImageSrc && cropImageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(cropImageSrc);
      }
      setCropImageSrc(null);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting the same file triggers change
    e.target.value = "";
    setError("");

    // If it's an image and cropping is enabled, open cropper modal first
    if (allowCrop && file.type && file.type.startsWith("image/")) {
      const objUrl = URL.createObjectURL(file);
      setPendingFile(file);
      setCropImageSrc(objUrl);
      setCropModalOpen(true);
      return;
    }

    // Direct upload otherwise
    await doUpload(file);
  };

  const handleApplyCrop = async (croppedBlob) => {
    const filename = pendingFile ? pendingFile.name : "cropped_banner.jpg";
    await doUpload(croppedBlob, filename);
  };

  const handleSkipCrop = async () => {
    setCropModalOpen(false);
    if (pendingFile) {
      await doUpload(pendingFile);
    }
  };

  const handleOpenCropOnExisting = () => {
    if (!value) return;
    setPendingFile(null);
    setCropImageSrc(value);
    setCropModalOpen(true);
  };

  const isPdf =
    typeof value === "string" &&
    (value.toLowerCase().includes(".pdf") || value.toLowerCase().endsWith(".pdf"));

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

        {/* Crop Button for existing image */}
        {value && !isPdf && allowCrop && (
          <button
            type="button"
            onClick={handleOpenCropOnExisting}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold transition-colors shrink-0"
            title="Crop & adjust image framing"
          >
            <CropIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Crop Image</span>
          </button>
        )}

        {/* Remove / Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors shrink-0"
            title="Remove image / clear background"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        )}

        {/* Upload Button */}
        <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-sm font-medium transition-colors shrink-0">
          <UploadCloud className="w-4 h-4 text-primary" />
          <span>Upload File</span>
          <input
            type="file"
            accept={accept}
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
              Uploading & Processing Media...
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
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Preview Thumbnail */}
      {value && (
        <div className="mt-2 flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-white/5 w-full sm:w-fit">
          <div className="flex items-center gap-3 min-w-0">
            {isPdf ? (
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg bg-slate-900 shrink-0"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-slate-300 font-medium truncate max-w-xs">
                {isPdf ? "PDF Document" : "Image Media"}
              </span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-primary hover:underline flex items-center gap-1 truncate max-w-xs"
              >
                <span className="truncate">{value}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-3">
            {!isPdf && allowCrop && (
              <button
                type="button"
                onClick={handleOpenCropOnExisting}
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                title="Crop image"
              >
                <CropIcon className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={cropImageSrc}
        initialAspect={aspectRatio || undefined}
        title={aspectRatio ? "Crop & Frame Wide Banner" : "Crop & Refine Image"}
        onClose={() => {
          setCropModalOpen(false);
          setPendingFile(null);
          if (cropImageSrc && cropImageSrc.startsWith("blob:")) {
            URL.revokeObjectURL(cropImageSrc);
          }
          setCropImageSrc(null);
        }}
        onApplyCrop={handleApplyCrop}
        onSkipCrop={pendingFile ? handleSkipCrop : undefined}
      />
    </div>
  );
};

