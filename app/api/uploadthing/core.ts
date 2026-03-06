import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Protecția e la nivel de pagină: doar /admin (clerkMiddleware) are acces.
// Nu folosim auth() aici ca să evităm eroarea Clerk pe live când middleware-ul nu e detectat.
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(() => ({}))
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),

  multiImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    .middleware(() => ({}))
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
