import { CookieConsentGate } from "@/app/components/CookieConsentGate";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CookieConsentGate>{children}</CookieConsentGate>;
}
