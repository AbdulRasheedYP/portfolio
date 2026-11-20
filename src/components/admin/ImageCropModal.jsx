import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  X,
  Check,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop as CropIcon,
  Loader2,
  Maximize2
} from "lucide-react";

const getRadianAngle = (degreeValue) => (degreeValue * Math.PI) / 180;

const rotateSize = (width, height, rotation) => {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
  };
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", async () => {
      // Fallback: try fetching as Blob to bypass direct crossOrigin taint where possible
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = (e) => reject(e);
        fallbackImg.src = blobUrl;
      } catch (fetchErr) {
        reject(fetchErr);
      }
    });
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * Crops and rotates the image on an HTML5 canvas and returns both Blob and DataURL.
 */
export const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d canvas context");
  }

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to match the rotated bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    throw new Error("No cropped canvas context");
  }

  const cropW = Math.max(1, Math.round(pixelCrop.width));
  const cropH = Math.max(1, Math.round(pixelCrop.height));

  croppedCanvas.width = cropW;
  croppedCanvas.height = cropH;

  croppedCtx.drawImage(
    canvas,
    Math.round(pixelCrop.x),
    Math.round(pixelCrop.y),
    cropW,
    cropH,
    0,
    0,
    cropW,
    cropH
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas export produced an empty blob"));
          return;
        }
        const dataUrl = croppedCanvas.toDataURL("image/jpeg", 0.92);
        resolve({ blob, dataUrl });
      },
      "image/jpeg",
      0.92
    );
  });
};

export const ImageCropModal = ({
  isOpen,
  imageSrc,
  onClose,
  onApplyCrop,
  onSkipCrop,
  initialAspect = 1140 / 300,
  title = "Crop & Frame Image"
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedAspect, setSelectedAspect] = useState(initialAspect);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropError, setCropError] = useState("");

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  if (!isOpen || !imageSrc) return null;

  const aspectOptions = [
    { label: "Wide Banner (1140:300)", value: 1140 / 300 },
    { label: "16:9", value: 16 / 9 },
    { label: "4:3", value: 4 / 3 },
    { label: "1:1 Square", value: 1 },
    { label: "Free", value: undefined }
  ];

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    setCropError("");

    try {
      const { blob, dataUrl } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      await onApplyCrop(blob, dataUrl);
      onClose();
    } catch (err) {
      console.error("Crop error:", err);
      setCropError(
        "Could not crop image directly (CORS or canvas issue). You can still proceed by clicking 'Use Original'."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <CropIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400">
                Drag to position, pinch or use slider to zoom & frame perfectly.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Viewport */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[380px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={selectedAspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropCompleteCallback}
            classes={{
              containerClassName: "rounded-none",
              cropAreaClassName: "border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
            }}
          />
        </div>

        {/* Error notification if CORS fails */}
        {cropError && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            {cropError}
          </div>
        )}

        {/* Toolbar Controls */}
        <div className="px-6 py-4 space-y-4 border-t border-white/10 bg-slate-950/80">
          {/* Aspect Ratio Options */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" />
              Aspect:
            </span>
            {aspectOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setSelectedAspect(opt.value)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium shrink-0 transition-all ${
                  selectedAspect === opt.value
                    ? "bg-primary text-black border-primary font-bold shadow-sm shadow-primary/30"
                    : "bg-slate-800/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Zoom and Rotate controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Zoom slider */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(1, prev - 0.2))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-primary h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-400 w-10 text-right">
                {zoom.toFixed(1)}x
              </span>
            </div>

            {/* Rotate Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-primary" />
                <span>Rotate 90°</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/10 bg-slate-950">
          <div>
            {onSkipCrop && (
              <button
                type="button"
                onClick={onSkipCrop}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline"
              >
                Skip Crop (Use Original)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-black bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all shadow-md shadow-primary/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cropping...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply & Save Crop</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
