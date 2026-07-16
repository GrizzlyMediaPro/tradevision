"use client";

import Link from "next/link";
import {
  FaTags,
  FaBuilding,
  FaYoutube,
  FaGraduationCap,
  FaEnvelope,
  FaPaperPlane,
  FaCog,
  FaClock,
  FaEuroSign,
  FaUsers,
  FaLink,
} from "react-icons/fa";

const menuItems = [
  {
    title: "Deals Carousel",
    description:
      "Gestionează ofertele și parteneriatele afișate în carousel pe pagina principală.",
    icon: FaTags,
    href: "/admin/deals",
    color: "from-purple-500 to-purple-600",
    iconBg: "bg-purple-500/15 border-purple-400/30",
    iconColor: "text-purple-300",
    shadow: "shadow-purple-500/20",
  },
  {
    title: "Firme",
    description:
      "Adaugă, editează sau șterge firmele de prop trading afișate pe site.",
    icon: FaBuilding,
    href: "/admin/firme",
    color: "from-sky-500 to-sky-600",
    iconBg: "bg-sky-500/15 border-sky-400/30",
    iconColor: "text-sky-300",
    shadow: "shadow-sky-500/20",
  },
  {
    title: "Link Widget YouTube",
    description:
      "Actualizează link-ul video-ului YouTube afișat pe pagina de acasă.",
    icon: FaYoutube,
    href: "/admin/linkwidget",
    color: "from-red-500 to-red-600",
    iconBg: "bg-red-500/15 border-red-400/30",
    iconColor: "text-red-300",
    shadow: "shadow-red-500/20",
  },
  {
    title: "Webinar",
    description:
      "Data și ora webinarului live, înscrierile din formular și sincronizarea cu pagina publică.",
    icon: FaClock,
    href: "/admin/webinar",
    color: "from-indigo-500 to-indigo-600",
    iconBg: "bg-indigo-500/15 border-indigo-400/30",
    iconColor: "text-indigo-300",
    shadow: "shadow-indigo-500/20",
  },
  {
    title: "Curs",
    description:
      "Gestionează capitolele cursului, video-urile și conținutul educațional.",
    icon: FaGraduationCap,
    href: "/admin/curs",
    color: "from-yellow-400 to-amber-500",
    iconBg: "bg-yellow-400/15 border-yellow-300/30",
    iconColor: "text-yellow-300",
    shadow: "shadow-yellow-500/20",
  },
  {
    title: "Prețuri cursuri",
    description:
      "Modifică prețurile cursurilor plătite afișate pe site și în checkout.",
    icon: FaEuroSign,
    href: "/admin/cursuri/preturi",
    color: "from-lime-500 to-green-600",
    iconBg: "bg-lime-500/15 border-lime-400/30",
    iconColor: "text-lime-300",
    shadow: "shadow-lime-500/20",
  },
  {
    title: "Reduceri Curs Futures",
    description:
      "Coduri de discount pentru achiziția Curs Futures.",
    icon: FaGraduationCap,
    href: "/admin/curs-futures/reduceri",
    color: "from-orange-500 to-amber-600",
    iconBg: "bg-orange-500/15 border-orange-400/30",
    iconColor: "text-orange-300",
    shadow: "shadow-orange-500/20",
  },
  {
    title: "Clienți Curs Futures",
    description:
      "Listă clienți care au finalizat plata pentru Curs Futures.",
    icon: FaGraduationCap,
    href: "/admin/curs-futures/clienti",
    color: "from-amber-500 to-yellow-600",
    iconBg: "bg-amber-500/15 border-amber-400/30",
    iconColor: "text-amber-300",
    shadow: "shadow-amber-500/20",
  },
  {
    title: "Utilizatori",
    description:
      "Vezi toți utilizatorii înregistrați pe site — caută, filtrează și sortează conturile.",
    icon: FaUsers,
    href: "/admin/users",
    color: "from-teal-500 to-teal-600",
    iconBg: "bg-teal-500/15 border-teal-400/30",
    iconColor: "text-teal-300",
    shadow: "shadow-teal-500/20",
  },
  {
    title: "Firme Tracker",
    description:
      "Gestionează firmele și link-urile de afiliere afișate pe pagina Payout Tracker.",
    icon: FaLink,
    href: "/admin/tracking-firms",
    color: "from-pink-500 to-pink-600",
    iconBg: "bg-pink-500/15 border-pink-400/30",
    iconColor: "text-pink-300",
    shadow: "shadow-pink-500/20",
  },
  {
    title: "Formular Contact",
    description: "Vizualizează mesajele primite prin formularul de contact.",
    icon: FaEnvelope,
    href: "/admin/formular",
    color: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-500/15 border-emerald-400/30",
    iconColor: "text-emerald-300",
    shadow: "shadow-emerald-500/20",
  },
  {
    title: "Newsletter",
    description:
      "Gestionează lista de abonați și trimite email-uri către abonați.",
    icon: FaPaperPlane,
    href: "/admin/newsletter",
    color: "from-orange-400 to-orange-500",
    iconBg: "bg-orange-400/15 border-orange-300/30",
    iconColor: "text-orange-300",
    shadow: "shadow-orange-500/20",
  },
];

export default function AdminPageClient() {
  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      {/* Heading */}
      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400/15 border border-yellow-300/30">
            <FaCog className="h-5 w-5 text-yellow-300" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          Admin Panel
        </h1>
        <div className="mt-3 h-[2px] w-[80px] bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-md mx-auto">
          Gestionează conținutul site-ului TradeVision din panoul de administrare.
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-6 py-7 md:px-7 md:py-8 shadow-[0_8px_18px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:from-white/[0.09] hover:to-white/[0.04] hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1`}
            >
              {/* Icon */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg} border transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>

              {/* Text */}
              <div className="mt-5">
                <h2 className="text-lg font-semibold text-white group-hover:text-white/95 transition">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action hint */}
              <div className="mt-5 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${item.color} px-4 py-1.5 text-xs font-semibold text-white shadow-lg ${item.shadow} transition-all duration-300 group-hover:shadow-xl group-hover:brightness-110`}
                >
                  Gestionează
                  <svg
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

