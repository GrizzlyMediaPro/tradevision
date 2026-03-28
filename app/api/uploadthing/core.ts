import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

async function adminOnly() {
  const user = await currentUser();
  if (!user) throw new UploadThingError("Unauthorized");

  const pub = (user.publicMetadata ?? {}) as Record<string, unknown>;
  const priv = (user.privateMetadata ?? {}) as Record<string, unknown>;
  if (pub.isAdmin !== true && priv.isAdmin !== true) {
    throw new UploadThingError("Forbidden");
  }

  return { userId: user.id };
}

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(adminOnly)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),

  multiImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    .middleware(adminOnly)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
