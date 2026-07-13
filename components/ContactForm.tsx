"use client";

import { useState, type FormEvent } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, CheckCircle2 } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loosely permissive phone validation (digits, spaces, dashes, parens, plus)
const PHONE_RE = /^[0-9()+\-.\s]{7,20}$/;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function validate(values: FormState): FieldErrors {
    const next: FieldErrors = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) {
      next.email = "Please enter your email.";
    } else if (!EMAIL_RE.test(values.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!values.phone.trim()) {
      next.phone = "Please enter a phone number.";
    } else if (!PHONE_RE.test(values.phone.trim())) {
      next.phone = "Please enter a valid phone number.";
    }
    if (!values.message.trim()) {
      next.message = "Let us know a bit about the job.";
    } else if (values.message.trim().length < 10) {
      next.message = "Please add a few more details (10+ characters).";
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
        "This site isn't connected to Firebase yet, so the form can't be submitted. Please call or email us directly using the info below."
      );
      return;
    }

    try {
      await addDoc(collection(db, "contactSubmissions"), {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setForm(INITIAL_STATE);
    } catch (err) {
      console.error("[ContactForm] submission failed:", err);
      setStatus("error");
      setErrorMessage(
        "Something went wrong sending your message. Please try again, or call/email us directly."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 border border-accent bg-surface p-10 text-center">
        <CheckCircle2 className="text-accent" size={40} strokeWidth={1.5} />
        <h3 className="font-heading text-xl uppercase tracking-wide text-foreground">
          Message Sent
        </h3>
        <p className="max-w-sm text-sm text-accent">
          Thanks for reaching out — we&apos;ll get back to you shortly to
          discuss your project.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 rounded-sm border border-accent px-6 py-2 font-heading text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-accent hover:text-background"
        >
          Send Another Message
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
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={(v) => handleChange("email", v)}
        error={errors.email}
        autoComplete="email"
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
          htmlFor="message"
          className="font-heading text-xs uppercase tracking-widest text-accent"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          className={`resize-none border bg-transparent px-4 py-3 text-foreground outline-none transition-colors placeholder:text-accent-dark focus:border-accent ${
            errors.message ? "border-foreground" : "border-border"
          }`}
          placeholder="Tell us about the job — what's going on, and where you're located."
        />
        {errors.message && (
          <p className="text-xs text-foreground">{errors.message}</p>
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
        {status === "submitting" ? "Sending..." : "Send Message"}
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
