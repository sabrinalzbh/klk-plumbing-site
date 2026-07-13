// EmailJS client-side email notifications.
//
// Fires an email (e.g. to the business inbox) whenever a new estimate
// request is submitted, so leads are seen immediately without checking the
// Firebase console. EmailJS is designed to send mail directly from the
// browser using a public key scoped to an allowed origin — no backend
// function required. See README.md for how to create the EmailJS service
// and template.
//
// This is a notification only, not the system of record: the estimate
// request itself is always saved to Firestore first (see
// components/EstimateForm.tsx). If the email fails to send, the submission
// is still safely stored and the form still reports success to the user.

import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

// Whether EmailJS env vars have actually been configured. Used by
// EstimateForm to skip the notification attempt (without failing the
// submission) when EmailJS hasn't been wired up yet.
export const isEmailJsConfigured = Boolean(
  SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY
);

export type EstimateNotificationParams = {
  name: string;
  phone: string;
  project_description: string;
  estimate_start_date: string;
};

// Sends the "new estimate request" notification email. Expects an EmailJS
// template with matching variables: {{name}}, {{phone}},
// {{project_description}}, {{estimate_start_date}}. Throws on failure —
// callers should catch this separately from the Firestore write so an email
// hiccup never blocks the (already-saved) submission from showing success.
export async function sendEstimateNotification(
  params: EstimateNotificationParams
) {
  if (!isEmailJsConfigured) {
    throw new Error("EmailJS is not configured (missing env vars).");
  }

  await emailjs.send(SERVICE_ID!, TEMPLATE_ID!, params, {
    publicKey: PUBLIC_KEY!,
  });
}
