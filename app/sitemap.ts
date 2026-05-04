import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://trade-vision.ro"
).replace(/\/$/, "");

const staticPaths: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] =
  [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/firme", changeFrequency: "weekly", priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/curs", changeFrequency: "monthly", priority: 0.8 },
    { path: "/politica-cookies", changeFrequency: "yearly", priority: 0.3 },
    { path: "/politica-confidentialitate", changeFrequency: "yearly", priority: 0.3 },
    { path: "/termeni-conditii", changeFrequency: "yearly", priority: 0.3 },
    { path: "/dezabonare", changeFrequency: "yearly", priority: 0.2 },
    { path: "/webinar", changeFrequency: "weekly", priority: 0.85 },
    { path: "/webinar/formular", changeFrequency: "weekly", priority: 0.8 },
  ];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const firms = await prisma.firm.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { name: "asc" },
  });

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(
    ({ path, changeFrequency, priority }) => ({
      url: path === "" ? `${baseUrl}/` : `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }),
  );

  const firmEntries: MetadataRoute.Sitemap = firms.map((f) => ({
    url: `${baseUrl}/firme/${f.slug}`,
    lastModified: f.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...firmEntries];
}
