import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { enUS, roRO } from "@clerk/localizations";
import "./globals.css";
import { SiteChrome } from "./components/SiteChrome";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { getLocale, getT } from "@/lib/i18n/get-t";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://trade-vision.ro"
).replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const locale = await getLocale();
  const title = t("meta.title");
  const description = t("meta.description");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: t("meta.titleTemplate"),
    },
    description,
    keywords: t("meta.keywords")
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    openGraph: {
      title,
      description,
      url: "/",
      siteName: locale === "ro" ? "TradeVision România" : "TradeVision",
      images: [
        {
          url: "/thumbnail.png",
          width: 1280,
          height: 720,
          alt: t("meta.ogAlt"),
        },
      ],
      locale: locale === "ro" ? "ro_RO" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/thumbnail.png"],
    },
    icons: {
      icon: "/favicon.ico",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const content = (
    <html lang={locale}>
      <body className={`page-gradient ${poppins.className} antialiased`}>
        <I18nProvider locale={locale}>
          <SiteChrome>{children}</SiteChrome>
        </I18nProvider>
      </body>
    </html>
  );
  return clerkKey ? (
    <ClerkProvider
      publishableKey={clerkKey}
      localization={locale === "ro" ? roRO : enUS}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      {content}
    </ClerkProvider>
  ) : (
    content
  );
}
