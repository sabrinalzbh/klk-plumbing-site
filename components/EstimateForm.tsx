"use client";

import { useState, type FormEvent } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, CheckCircle2 } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { sendEstimateNotification, isEmailJsConfigured } from "@/lib/emailjs";

type FormState = {
  name: string;
  phone: string;
  projectDescription: string;
  estimateStartDate: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_STATE: FormState = {
  name: "",
  phone: "",
  projectDescription: "",
  estimateStartDate: "",
};

// Loosely permissive phone validation (digits, spaces, dashes, parens, plus)
const PHONE_RE = /^[0-9()+\-.\s]{7,20}$/;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export default function EstimateForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const minDate = todayISO();

  function validate(values: FormState): FieldErrors {
    const next: FieldErrors = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.phone.trim()) {
      next.phone = "Please enter a phone number.";
    } else if (!PHONE_RE.test(values.phone.trim())) {
      next.phone = "Please enter a valid phone number.";
    }
    if (!values.projectDescription.trim()) {
      next.projectDescription = "Let us know a bit about the project.";
    } else if (values.projectDescription.trim().length < 10) {
      next.projectDescription =
        "Please add a few more details (10+ characters).";
    }
    if (!values.estimateStartDate) {
      next.estimateStartDate = "Please choose a preferred start date.";
    } else if (values.estimateStartDate < minDate) {
      next.estimateStartDate = "Please choose today or a future date.";
    }
    return next;
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    if (!isFirebaseConfigured) {
      // Firebase isn't configured yet in this environment — fail gracefully
      // with a clear message rather than throwing a raw SDK error.
      setStatus("error");
      setErrorMessage(
        "This site isn't connected to Firebase yet, so the form can't be submitted. Please call us directly using the info below."
      );
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      projectDescription: form.projectDescription.trim(),
      estimateStartDate: form.estimateStartDate,
    };

    try {
      // The Firestore write is the system of record for every lead — it
      // must succeed for the form to report success.
      await addDoc(collection(db, "estimateRequests"), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("[EstimateForm] Firestore write failed:", err);
      setStatus("error");
      setErrorMessage(
        "Something went wrong sending your request. Please try again, or call us directly."
      );
      return;
    }

    // Email notification is best-effort: the request is already saved, so a
    // failure here shouldn't block the success state shown to the visitor.
    if (isEmailJsConfigured) {
      try {
        await sendEstimateNotification({
          name: payload.name,
          phone: payload.phone,
          project_description: payload.projectDescription,
          estimate_start_date: payload.estimateStartDate,
        });
      } catch (err) {
        console.error("[EstimateForm] EmailJS notification failed:", err);
      }
    }

    setStatus("success");
    setForm(INITIAL_STATE);
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 border border-accent bg-surface p-10 text-center">
        <CheckCircle2 className="text-accent" size={40} strokeWidth={1.5} />
        <h3 className="font-heading text-xl uppercase tracking-wide text-foreground">
          Estimate Request Received
        </h3>
        <p className="max-w-sm text-sm text-accent">
          Thanks, {form.name || "there"} — we&apos;ll review your project and
          follow up shortly to confirm your estimate.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 rounded-sm border border-accent px-6 py-2 font-heading text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-accent hover:text-background"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field
        label="Name"
        name="name"
        value={form.name}
        onChange={(v) => handleChange("name", v)}
        error={errors.name}
        autoComplete="name"
      />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={(v) => handleChange("phone", v)}
        error={errors.phone}
        autoComplete="tel"
      />
      <div className="flex flex-col gap-2">
        <label
          htmlFor="projectDescription"
          className="font-heading text-xs uppercase tracking-widest text-accent"
        >
          Project Description
        </label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          rows={5}
          value={form.projectDescription}
          onChange={(e) => handleChange("projectDescription", e.target.value)}
          aria-invalid={Boolean(errors.projectDescription)}
          className={`resize-none border bg-transparent px-4 py-3 text-foreground outline-none transition-colors placeholder:text-accent-dark focus:border-accent ${
            errors.projectDescription ? "border-foreground" : "border-border"
          }`}
          placeholder="Tell us about the job — what's going on, and where you're located."
        />
        {errors.projectDescription && (
          <p className="text-xs text-foreground">
            {errors.projectDescription}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="estimateStartDate"
          className="font-heading text-xs uppercase tracking-widest text-accent"
        >
          Preferred Estimate Start Date
        </label>
        <input
          id="estimateStartDate"
          name="estimateStartDate"
          type="date"
          min={minDate}
          value={form.estimateStartDate}
          onChange={(e) => handleChange("estimateStartDate", e.target.value)}
          aria-invalid={Boolean(errors.estimateStartDate)}
          style={{ colorScheme: "dark" }}
          className={`border bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-accent ${
            errors.estimateStartDate ? "border-foreground" : "border-border"
          }`}
        />
        {errors.estimateStartDate && (
          <p className="text-xs text-foreground">{errors.estimateStartDate}</p>
        )}
      </div>

      {status === "error" && errorMessage && (
        <div className="border border-foreground bg-surface px-4 py-3 text-sm text-foreground">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex items-center justify-center gap-2 rounded-sm bg-accent px-8 py-4 font-heading text-sm uppercase tracking-widest text-background transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" && (
          <Loader2 className="animate-spin" size={18} />
        )}
        {status === "submitting" ? "Sending..." : "Request Estimate"}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
};

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="font-heading text-xs uppercase tracking-widest text-accent"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={`border bg-transparent px-4 py-3 text-foreground outline-none transition-colors placeholder:text-accent-dark focus:border-accent ${
          error ? "border-foreground" : "border-border"
        }`}
      />
      {error && <p className="text-xs text-foreground">{error}</p>}
    </div>
  );
}
