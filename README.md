# KLK Plumbing LLC — Website

A Next.js 14 (App Router, TypeScript, Tailwind CSS) marketing site for KLK
Plumbing LLC, serving Greater Cleveland, OH. Includes a Firebase-backed
estimate request form (Firestore, with an EmailJS email notification on
every submission) and project galleries (Firebase Storage), and is
configured to deploy on Netlify via `@netlify/plugin-nextjs`.

## What Was Built

- **Home** (`app/page.tsx`) — full-bleed hero over the Cleveland skyline
  photo, a three-part service overview (Residential / Commercial /
  Industrial) linking to anchored sections on the Services page, and a
  "trust" stats section.
- **About** (`app/about/page.tsx`) — company story, mission, service area,
  and an owner bio section (placeholder copy — see checklist below).
- **Services** (`app/services/page.tsx`) — three gallery sections
  (`#residential`, `#commercial`, `#industrial`) that fetch images from
  Firebase Storage at runtime, with graceful placeholder tiles when Storage
  is empty or Firebase isn't configured yet.
- **Contact** (`app/contact/page.tsx`) — estimate request form
  (`components/EstimateForm.tsx`: name, phone, project description,
  preferred start date) that writes to Firestore (`estimateRequests`) and
  triggers an EmailJS email notification on submit, plus phone/email/
  service-area text and an embedded Google Map (iframe, no API key
  required).
- **Nav / Footer** (`components/Nav.tsx`, `components/Footer.tsx`) — shared
  across every page via `app/layout.tsx`. Nav collapses to a mobile drawer;
  footer shows company name, contact info, service area, and a
  dynamically-computed copyright year.
- **Design system** — black/off-white/gunmetal-silver palette defined once
  in `tailwind.config.ts` (`background`, `foreground`, `accent` + shades),
  Oswald for headings and Work Sans for body text via `next/font/google`,
  and a small IntersectionObserver-based scroll-reveal (`hooks/useScrollReveal.ts`,
  wrapped by `components/Reveal.tsx`) used throughout for subtle fade-up
  animations.

## Local Setup

```bash
npm install
cp .env.local.example .env.local   # then fill in real Firebase values (see below)
npm run dev
```

Visit `http://localhost:3000`.

Until `.env.local` has real Firebase values, the site still runs fine: the
estimate form shows a clear inline error instead of submitting, and the
galleries show "Photo coming soon" placeholder tiles instead of erroring.
EmailJS notifications are skipped silently (logged to the console) until
its env vars are set — this never blocks the form, since the Firestore
write is the system of record for a lead.

## Firebase Setup

1. Go to the [Firebase console](https://console.firebase.google.com/) and
   create a new project (or use an existing one).
2. **Add a Web App** (Project settings → General → Your apps → Web) and
   copy the config values into `.env.local` (see `.env.local.example` for
   the exact variable names).
3. **Enable Firestore**: Build → Firestore Database → Create database
   (start in production mode, then apply the rules below).
4. **Enable Storage**: Build → Storage → Get started (same region as
   Firestore is fine).
5. Deploy the Firestore rules. Either:
   - Paste the contents of `firestore.rules` (project root) into the
     Firestore rules tab in the console, **or**
   - Use the Firebase CLI: `npx firebase-tools deploy --only firestore:rules`
     (uses `firebase.json` + `firestore.rules`, already included in this
     repo — you'll need to run `firebase login` and `firebase use
     <your-project-id>` first).
6. Deploy the Storage rules below via the Storage rules tab in the console
   (no `storage.rules` file is included in this repo — only the estimate
   form's Firestore rules are managed as a file, since Storage is
   read-only from the client and populated manually).

### Firestore Security Rules

`firestore.rules` (project root) — locks the estimate request collection
down to create-only from the client, with no public read access:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Estimate request form: anyone can create a submission, no one can
    // read/update/delete from the client — view/manage leads directly in
    // the Firebase console.
    match /estimateRequests/{requestId} {
      allow create: if true;
      allow read, update, delete: if false;
    }

    // Optional gallery captions: public read, no client writes
    // (manage captions from the console or an admin script).
    match /galleryMeta/{docId} {
      allow read: if true;
      allow write: if false;
    }

    // Deny everything else by default.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Storage Security Rules (minimal example)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access for gallery images, no client-side uploads.
    // Upload real photos via the Firebase console or Storage CLI/SDK
    // with an authenticated admin account.
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

> These are minimal starting points, not production-hardened rules. If you
> later add an admin dashboard to manage leads or upload photos, tighten
> `estimateRequests` reads and `gallery` writes to authenticated admin
> users only.

### Storage Folder Structure for Galleries

The Services page (`app/services/page.tsx` + `components/Gallery.tsx` +
`lib/gallery.ts`) expects images in Firebase Storage under:

```
gallery/
  residential/   <- any .jpg/.png/.webp files
  commercial/
  industrial/
```

Just upload image files into the matching folder — no naming convention
required. Optional captions can be added via a Firestore collection called
`galleryMeta`, with a document per file keyed by its full Storage path
(e.g. `gallery/residential/kitchen-repipe.jpg`) containing a `caption`
string and/or `order` number. See the comments at the top of `lib/gallery.ts`
for details.

## EmailJS Setup

Every estimate request is always saved to Firestore regardless of email
delivery — EmailJS just adds an immediate inbox notification on top of that.

1. Create a free account at [emailjs.com](https://www.emailjs.com/) and add
   an **Email Service** (e.g. connect the Gmail/Outlook inbox that should
   receive lead notifications) — this gives you a **Service ID**.
2. Create an **Email Template** with a destination "To Email" set to your
   business inbox, and a body that references these template variables
   (they're sent by `lib/emailjs.ts` on every submission):
   - `{{name}}`
   - `{{phone}}`
   - `{{project_description}}`
   - `{{estimate_start_date}}`

   This gives you a **Template ID**.
3. Grab your **Public Key** from Account → General.
4. Add all three to `.env.local` (and later, Netlify env vars):
   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
   ```
5. In the EmailJS dashboard, under your account's **Security** settings,
   restrict allowed origins to your real domain(s) (e.g.
   `https://klkplumbing.com`, `http://localhost:3000` for local testing) —
   the public key is meant to be exposed client-side, and origin
   allow-listing is what keeps it from being abused.

## Deploying to Netlify

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project**, connect the
   repo.
3. Build settings should auto-detect from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Plugin: `@netlify/plugin-nextjs` (already declared in `netlify.toml`;
     Netlify will install it automatically as part of the Next.js runtime)
4. In **Site configuration → Environment variables**, add all nine
   variables from `.env.local.example` (six `NEXT_PUBLIC_FIREBASE_*` values
   plus the three `NEXT_PUBLIC_EMAILJS_*` values) with your real values.
5. Deploy. Because this uses the Next.js Netlify runtime (not static
   export), the estimate form's client-side Firestore write and EmailJS
   notification both work normally on Netlify.

## Maintenance Mode ("Coming Soon")

Before launch, the whole site can be swapped out for a simple "coming soon"
splash page (logo, phone, email — no nav/footer, no real pages reachable)
via `middleware.ts`, while you (or I) can still browse the real site using a
secret bypass link.

- **Turn it on**: set `MAINTENANCE_MODE=true` and a
  `MAINTENANCE_BYPASS_KEY` (any long random string) as Netlify environment
  variables, then trigger a redeploy. Every visitor is redirected to
  `/coming-soon`.
- **Preview the real site while it's on**: visit any page with
  `?preview=<MAINTENANCE_BYPASS_KEY>` appended, e.g.
  `https://klkplumbing.com/?preview=your-secret-key`. That sets a 30-day
  cookie in your browser so you don't need to keep adding the query param —
  the rest of the site works normally for you from then on, while everyone
  else still only sees the splash page.
- **Turn it off**: set `MAINTENANCE_MODE=false` (or delete the variable)
  and redeploy. The whole site becomes visible to everyone again.
- The splash page itself lives at `app/coming-soon/page.tsx` and reuses the
  same placeholder phone/email as the rest of the site — update it in the
  same pass as the other placeholder content.

## Placeholder Content Checklist

Everything below is realistic-sounding placeholder content, not real KLK
Plumbing LLC information. Search the codebase for these values and replace
before launch:

- **Phone number**: `(216) 555-0142` — appears in `components/Footer.tsx`,
  `app/contact/page.tsx`.
- **Email**: `info@klkplumbing.com` — same two files.
- **Service area copy**: "Greater Cleveland, OH" — used across
  `components/Footer.tsx`, `app/contact/page.tsx`, `components/TrustSection.tsx`,
  `app/about/page.tsx`. Confirm/adjust the exact list of cities/counties served.
- **Trust section stats** (`components/TrustSection.tsx`): "15+ Years",
  "Licensed & Insured" claim, and service-area line — replace with verified
  figures and actual license/insurance details. Clearly commented in the
  file as placeholder.
- **About page copy** (`app/about/page.tsx`): company story, mission
  statement, and "Meet the Owner" section (including the `[Owner Name]`
  placeholder) — replace with the real founding story and owner bio.
  Clearly commented in the file as placeholder.
- **Google Map embed** (`app/contact/page.tsx`): currently centered on
  "Cleveland, OH" generically via a simple iframe query — replace the query
  in the `src` URL with your exact business address/pin once you have one
  you want displayed publicly.
- **Metadata / SEO copy** (`app/layout.tsx`, per-page `metadata` exports):
  reasonable defaults were written but should be reviewed for accuracy.
- **EmailJS credentials** (`.env.local` / Netlify env vars): the site works
  and estimate requests are still saved to Firestore without these, but no
  email notification will be sent until a real EmailJS service/template/
  public key are configured. See "EmailJS Setup" above.

## Tech Notes

- `lib/firebase.ts` exports `isFirebaseConfigured`, which is `false` until
  real env vars are set. `components/EstimateForm.tsx` and `lib/gallery.ts`
  both check this flag to fail gracefully (styled inline message / placeholder
  tiles) instead of throwing.
- `lib/emailjs.ts` exports `isEmailJsConfigured` the same way.
  `EstimateForm` always writes to Firestore first — the email notification
  is attempted afterward and any failure is caught separately and logged,
  so it never turns an already-saved lead into a failed submission from the
  visitor's point of view.
- All colors are defined once in `tailwind.config.ts` (`background`,
  `foreground`, `accent` + `accent-light`/`accent-dark`, `surface`,
  `border`) and referenced via Tailwind utility classes everywhere — no
  hardcoded hex colors in components, including form success/error states
  (no red/green — everything stays within the black/white/silver palette).
- Scroll-reveal animation is a small IntersectionObserver hook
  (`hooks/useScrollReveal.ts`) wrapped by `components/Reveal.tsx`; no
  external animation library is used.

## Verified Before Handoff

`npm install`, `npm run dev` (boot check), and `npm run build` were all run
successfully in this environment with no real Firebase or EmailJS project
configured (env vars unset), confirming the graceful-fallback behavior
works. Actual Firestore writes, Storage reads, and EmailJS delivery against
real projects have **not** been verified — you'll want to test the estimate
form and galleries end-to-end once real credentials are in place.
