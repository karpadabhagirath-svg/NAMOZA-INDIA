"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { createOrder } from "@/lib/api";
import { Order } from "@/lib/types";
import MagneticButton from "../MagneticButton";
import Confirmation from "./Confirmation";
import ProgressBar from "./ProgressBar";
import StepDetails from "./StepDetails";
import StepOptions from "./StepOptions";
import StepReview from "./StepReview";
import StepUpload from "./StepUpload";
import { INITIAL_ORDER_FORM, OrderFormState } from "./types";

const TOTAL_STEPS = 4;

function validateStep(step: number, form: OrderFormState): string | null {
  if (step === 0 && form.photos.length === 0) return "Please upload at least one photo.";
  if (step === 2) {
    if (!form.customerName.trim()) return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) return "Please enter a valid email.";
    if (form.customerPhone.trim().length < 6) return "Please enter a valid phone number.";
    if (form.shippingAddress.trim().length < 10) return "Please enter your full shipping address.";
  }
  return null;
}

export default function OrderWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<OrderFormState>(INITIAL_ORDER_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const update = (patch: Partial<OrderFormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const goNext = () => {
    const validationError = validateStep(step, form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    setError("");
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const { order: createdOrder } = await createOrder({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        shippingAddress: form.shippingAddress,
        material: form.material,
        size: form.size,
        customSizeNotes: form.customSizeNotes || undefined,
        baseEngraving: form.baseEngraving || undefined,
        poseNotes: form.poseNotes || undefined,
        referenceNotes: form.referenceNotes || undefined,
        photos: form.photos,
      });
      setOrder(createdOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (order) {
    return (
      <section className="px-6 py-24 sm:py-32">
        <Confirmation order={order} />
      </section>
    );
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: -dir * 40 }),
  };

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <ProgressBar current={step} />

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && <StepUpload form={form} update={update} />}
              {step === 1 && <StepOptions form={form} update={update} />}
              {step === 2 && <StepDetails form={form} update={update} />}
              {step === 3 && <StepReview form={form} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || submitting}
            className="flex items-center gap-1 text-sm text-silver-300/70 transition-colors hover:text-mist-100 disabled:opacity-30"
          >
            <ChevronLeft size={16} /> Back
          </button>

          <MagneticButton onClick={goNext} disabled={submitting}>
            {submitting ? "Submitting…" : step === TOTAL_STEPS - 1 ? "Submit Order" : "Continue"}
            {!submitting && <ChevronRight size={16} />}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
