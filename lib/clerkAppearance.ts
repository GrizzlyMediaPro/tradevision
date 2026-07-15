import { dark } from "@clerk/themes";

/**
 * Temă Clerk aliniată la identitatea vizuală a site-ului.
 * Pornește de la tema `dark` oficială (contrast corect pe toate elementele
 * mărunte) și suprascrie doar culorile de brand: card închis solid,
 * buton principal galben ca CTA-ul din Hero, accente galbene pe linkuri.
 */
export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#facc15",
    // v6 folosește încă denumirile vechi; le setăm pe ambele pentru siguranță
    colorTextOnPrimaryBackground: "#0f172a",
    colorPrimaryForeground: "#0f172a",
    colorBackground: "#0b0d1d",
    colorText: "#f5f5f7",
    colorForeground: "#f5f5f7",
    colorTextSecondary: "rgba(255, 255, 255, 0.6)",
    colorMutedForeground: "rgba(255, 255, 255, 0.6)",
    colorInputBackground: "rgba(0, 0, 0, 0.45)",
    colorInput: "rgba(0, 0, 0, 0.45)",
    colorInputText: "#f5f5f7",
    colorInputForeground: "#f5f5f7",
    colorNeutral: "#ffffff",
    colorDanger: "#f87171",
    colorSuccess: "#34d399",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
    fontSize: "0.875rem",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    cardBox: "w-full border border-white/10 shadow-[0_8px_18px_rgba(0,0,0,0.45)]",
    headerTitle: "text-center",
    headerSubtitle: "text-center",
    formButtonPrimary:
      "bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 !text-slate-900 font-semibold !shadow-[0_10px_24px_rgba(250,204,21,0.25)] hover:brightness-110 transition cursor-pointer !border-0",
    footerActionLink: "text-yellow-300 hover:text-yellow-200 font-semibold",
    formResendCodeLink: "text-yellow-300 hover:text-yellow-200",
    identityPreviewEditButton: "text-yellow-300 hover:text-yellow-200",
    backLink: "text-yellow-300 hover:text-yellow-200",
  },
};

/**
 * Variantă pentru UserButton din navbar: aceleași culori de brand,
 * dar fără constrângerile de layout ale cardului de sign-in.
 */
export const clerkUserButtonAppearance = {
  baseTheme: dark,
  variables: clerkAppearance.variables,
  elements: {
    userButtonBox: "!size-9 md:!size-11 shrink-0",
    userButtonTrigger: "!size-9 md:!size-11 rounded-full",
    userButtonAvatarBox:
      "!size-9 md:!size-11 !rounded-full ring-2 ring-white/20 hover:ring-yellow-300/60 transition shadow-md",
    userButtonAvatarImage: "!size-full object-cover",
    userButtonPopoverCard:
      "border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.55)]",
    userButtonPopoverActionButton: "hover:bg-white/5",
  },
};
