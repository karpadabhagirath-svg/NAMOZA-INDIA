"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, X } from "lucide-react";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { OrderFormState } from "./types";

const MAX_FILES = 6;
const MAX_SIZE_MB = 10;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

interface Props {
  form: OrderFormState;
  update: (patch: Partial<OrderFormState>) => void;
}

export default function StepUpload({ form, update }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = form.photos.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.photos]);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setError("");
    const incoming = Array.from(fileList);
    const valid: File[] = [];

    for (const file of incoming) {
      if (!ACCEPTED.includes(file.type)) {
        setError("Only JPEG, PNG, WEBP or HEIC photos are supported.");
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Each photo must be under ${MAX_SIZE_MB}MB.`);
        continue;
      }
      valid.push(file);
    }

    const combined = [...form.photos, ...valid].slice(0, MAX_FILES);
    if (form.photos.length + valid.length > MAX_FILES) {
      setError(`You can upload up to ${MAX_FILES} photos.`);
    }
    update({ photos: combined });
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const removePhoto = (idx: number) => {
    update({ photos: form.photos.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <h2 className="font-display text-2xl text-mist-100">Upload your photos</h2>
      <p className="mt-2 text-sm text-silver-300/70">
        Clear, well-lit photos give the best result. Front-facing works best. Up to {MAX_FILES} photos.
      </p>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
          dragActive ? "border-gold-400 bg-gold-500/5" : "border-white/10 bg-graphite-900/50 hover:border-gold-400/40"
        }`}
      >
        <ImagePlus className="text-gold-400" size={30} />
        <p className="text-sm text-silver-200/80">
          Drag &amp; drop photos here, or <span className="text-gold-300">browse</span>
        </p>
        <p className="text-xs text-silver-300/50">JPEG, PNG, WEBP or HEIC — up to {MAX_SIZE_MB}MB each</p>
        <input type="file" accept={ACCEPTED.join(",")} multiple className="hidden" onChange={handleInput} />
      </label>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <AnimatePresence>
        {form.photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4"
          >
            {form.photos.map((file, idx) => (
              <motion.div
                key={`${file.name}-${idx}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previews[idx]} alt={file.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-graphite-950/80 text-mist-100 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
