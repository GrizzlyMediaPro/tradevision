import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { roRO } from "@clerk/localizations";
import "./globals.css";
import { SiteChrome } from "./components/SiteChrome";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const defaultTitle = "TradeVision România - Comparații prop firms & oferte";
const defaultDescription =
  "Comparații detaliate între prop firms, oferte cu discount și prezentări de firme pentru traderi români, realizate de TradeVision România.";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://trade-vision.ro"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | TradeVision România",
  },
  description: defaultDescription,
  keywords: [
    "tradevision",
    "tradevision românia",
    "prop firm",
    "prop trading",
    "comparație prop firm",
    "oferte prop firm",
    "discount prop firm",
    "trading românia",
  ],
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    siteName: "TradeVision România",
    images: [
      {
        url: "/thumbnail.png",
        width: 1280,
        height: 720,
        alt: "TradeVision România - Comparații prop firms & oferte",
      },
    ],
    locale: "ro_RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const content = (
    <html lang="ro">
      <body className={`page-gradient ${poppins.className} antialiased`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
  return clerkKey ? (
    <ClerkProvider publishableKey={clerkKey} localization={roRO}>
      {content}
    </ClerkProvider>
  ) : (
    content
  );
}
