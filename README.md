# KLK Plumbing LLC — Website

A Next.js 14 (App Router, TypeScript, Tailwind CSS) marketing site for KLK
Plumbing LLC, serving Greater Cleveland, OH. Includes a Firebase-backed
contact form (Firestore) and project galleries (Firebase Storage), and is
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
- **Contact** (`app/contact/page.tsx`) — contact form that writes to
  Firestore (`contactSubmissions`), plus phone/email/service-area text and
  an embedded Google Map (iframe, no API key required).
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
contact form shows a clear inline error instead of submitting, and the
galleries show "Photo coming soon" placeholder tiles instead of erroring.

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
5. Deploy the security rules below (Firestore rules tab / Storage rules
   tab in the console, or via the Firebase CLI).

### Firestore Security Rules (minimal example)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Contact form: anyone can create a submission, no one can read/update/delete
    // from the client (read them from the Firebase console or an admin tool).
    match /contactSubmissions/{submissionId} {
      allow create: if true;
      allow read, update, delete: if false;
    }

    // Optional gallery captions: public read, no client writes
    // (manage captions from the console or an admin script).
    match /galleryMeta/{docId} {
      allow read: if true;
      allow write: if false;
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
> later add an admin dashboard to manage submissions or upload photos,
> tighten `contactSubmissions` reads and `gallery` writes to authenticated
> admin users only.

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

## Deploying to Netlify

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project**, connect the
   repo.
3. Build settings should auto-detect from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Plugin: `@netlify/plugin-nextjs` (already declared in `netlify.toml`;
     Netlify will install it automatically as part of the Next.js runtime)
4. In **Site configuration → Environment variables**, add the same six
   `NEXT_PUBLIC_FIREBASE_*` variables from `.env.local.example` with your
   real Firebase values.
5. Deploy. Because this uses the Next.js Netlify runtime (not static
   export), the contact form's client-side Firestore write works normally
   on Netlify.

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

## Tech Notes

- `lib/firebase.ts` exports `isFirebaseConfigured`, which is `false` until
  real env vars are set. `components/ContactForm.tsx` and `lib/gallery.ts`
  both check this flag to fail gracefully (styled inline message / placeholder
  tiles) instead of throwing.
- All colors are defined once in `tailwind.config.ts` (`background`,
  `foreground`, `accent` + `accent-light`/`accent-dark`, `surface`,
  `border`) and referenced via Tailwind utility classes everywhere — no
  hardcoded hex colors in components.
- Scroll-reveal animation is a small IntersectionObserver hook
  (`hooks/useScrollReveal.ts`) wrapped by `components/Reveal.tsx`; no
  external animation library is used.

## Verified Before Handoff

`npm install`, `npm run dev` (boot check), and `npm run build` were all run
successfully in this environment with no real Firebase project configured
(env vars unset), confirming the graceful-fallback behavior works. Actual
Firestore writes / Storage reads against a real Firebase project have **not**
been verified — you'll want to test the contact form and galleries end-to-end
once real Firebase credentials are in place.
