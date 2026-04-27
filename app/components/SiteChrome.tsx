"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

type SiteChromeProps = {
  children: React.ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();
  const hideChrome =
    pathname === "/webinar" || pathname?.startsWith("/webinar/formular");

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
