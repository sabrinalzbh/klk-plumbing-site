// Helper for fetching gallery images from Firebase Storage.
//
// EXPECTED STORAGE FOLDER STRUCTURE
// ----------------------------------
// gallery/
//   residential/   <- any image files (jpg/png/webp) go here
//   commercial/
//   industrial/
//
// Each category folder is listed with Storage's `listAll()`, and a public
// download URL is generated per file with `getDownloadURL()`. There is no
// required naming convention — just drop images into the right folder.
//
// Optional captions: if you want captions/ordering, create a Firestore
// collection called `galleryMeta` with documents keyed by the Storage file
// path (e.g. "gallery/residential/kitchen-repipe.jpg") containing a
// `caption` string and/or `order` number. This helper will merge that data
// in when available, but Storage listing is always the source of truth for
// *which* images exist.
//
// GRACEFUL FALLBACK
// ------------------
// If Firebase isn't configured yet (see lib/firebase.ts -> isFirebaseConfigured)
// or a category folder is empty / errors out, this returns an empty array and
// the calling <Gallery> component renders placeholder tiles instead of
// broken images or an empty section.

import { listAll, ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { db, storage, isFirebaseConfigured } from "./firebase";

export type GalleryCategory = "residential" | "commercial" | "industrial";

export type GalleryImage = {
  url: string;
  path: string;
  caption?: string;
};

type GalleryMetaDoc = {
  caption?: string;
  order?: number;
};

export async function getGalleryImages(
  category: GalleryCategory
): Promise<GalleryImage[]> {
  if (!isFirebaseConfigured) {
    return [];
  }

  try {
    const folderRef = ref(storage, `gallery/${category}`);
    const listing = await listAll(folderRef);

    if (listing.items.length === 0) {
      return [];
    }

    // Best-effort fetch of caption metadata; if this fails or the
    // collection doesn't exist, we simply skip captions.
    const metaByPath = new Map<string, GalleryMetaDoc>();
    try {
      const metaSnap = await getDocs(collection(db, "galleryMeta"));
      metaSnap.forEach((doc) => {
        metaByPath.set(doc.id, doc.data() as GalleryMetaDoc);
      });
    } catch {
      // No galleryMeta collection / rules block read — that's fine, captions are optional.
    }

    const images = await Promise.all(
      listing.items.map(async (item) => {
        const url = await getDownloadURL(item);
        const meta = metaByPath.get(item.fullPath);
        return {
          url,
          path: item.fullPath,
          caption: meta?.caption,
          order: meta?.order ?? 0,
        };
      })
    );

    return images
      .sort((a, b) => a.order - b.order)
      .map(({ url, path, caption }) => ({ url, path, caption }));
  } catch (error) {
    // Network error, missing bucket, permission denied, etc. — fail soft.
    console.warn(`[gallery] Could not load "${category}" images:`, error);
    return [];
  }
}
