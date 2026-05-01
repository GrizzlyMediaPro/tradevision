import { CookieConsentGate } from "@/app/components/CookieConsentGate";

export default function WebinarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CookieConsentGate>{children}</CookieConsentGate>;
}
