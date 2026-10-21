import { FaClock } from "react-icons/fa";

const lessons = [
  {
    title: "Ce este tranzacționarea?",
    description:
      "Piețele, instrumentele și de ce majoritatea pierd bani înainte să aibă un proces.",
    duration: "~17 min",
  },
  {
    title: "Tranzacționarea ca business",
    description:
      "Obiective, reguli de risc și o rutină zilnică, nu o serie de impulsuri.",
    duration: "~22 min",
  },
  {
    title: "Platforma și graficele",
    description:
      "Setările de bază, contul demo și cum nu te pierzi în butoane.",
    duration: "~18 min",
  },
  {
    title: "Cum citești un grafic",
    description:
      "Lumânări, timeframe-uri și structura mișcării, pas cu pas.",
    duration: "~28 min",
  },
  {
    title: "Contextul zilei",
    description:
      "Sesiuni, știri și când merită să stai departe de piață.",
    duration: "~16 min",
  },
  {
    title: "Abordarea corectă",
    description:
      "Răbdarea, selecția configurațiilor și oprirea tranzacționării excesive.",
    duration: "~20 min",
  },
  {
    title: "Managementul riscului",
    description:
      "Cât riști pe tranzacție, unde pui stopul și cum supraviețuiești unei serii proaste.",
    duration: "~19 min",
  },
  {
    title: "Cum formezi strategia",
    description:
      "Reguli de intrare și ieșire pe care le poți verifica, nu le simți.",
    duration: "~24 min",
  },
  {
    title: "Jurnalul de tranzacții",
    description:
      "Ce notezi după fiecare trade ca să vezi tiparul, nu doar rezultatul.",
    duration: "~14 min",
  },
  {
    title: "Testarea înainte de bani reali",
    description:
      "Cum treci strategia prin cont demo până ai suficiente exemple.",
    duration: "~15 min",
  },
  {
    title: "Fluxul de ordine",
    description:
      "Intenția participanților mari și cum o folosești la intrare.",
    duration: "~21 min",
  },
  {
    title: "Execuția",
    description:
      "De la planul scris la click: ce nu schimbi în timp ce ești în tranzacție.",
    duration: "~13 min",
  },
  {
    title: "Psihologia unei sesiuni",
    description:
      "Frica, răzbunarea și cum închizi platforma când nu mai ești lucid.",
    duration: "~18 min",
  },
  {
    title: "Firme de finanțare",
    description:
      "Reguli, limite zilnice și cum îți adaptezi strategia fără să o strici.",
    duration: "~23 min",
  },
  {
    title: "Planul până la prima retragere",
    description:
      "Etapele de la provocare la payout și greșelile care le lungesc.",
    duration: "~16 min",
  },
];

function LessonCard({
  index,
  lesson,
}: {
  index: number;
  lesson: (typeof lessons)[number];
}) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-4 py-5 text-left shadow-[0_8px_18px_rgba(0,0,0,0.45)] md:px-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-600 text-xs font-bold text-white shadow-[0_8px_20px_rgba(147,51,234,0.4)]">
        {String(index + 1).padStart(2, "0")}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-white md:text-base">{lesson.title}</h3>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-white/50 md:text-sm">
        {lesson.description}
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-white/35">
        <FaClock className="h-3 w-3" />
        {lesson.duration}
      </span>
    </article>
  );
}

export function CurriculumSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1250px] px-4 pt-20 pb-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold uppercase tracking-wide text-white md:text-3xl">
            15 lecții. Un singur obiectiv: să înțelegi piața.
          </h2>
          <div className="mx-auto mt-3 h-[2px] w-[80px] rounded-full bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500" />
          <p className="mx-auto mt-5 max-w-lg text-sm text-white/55 md:text-base">
            Parcurge-le în ordine. La final, o să te uiți la un grafic și o să
            știi exact ce vezi.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {lessons.map((lesson, index) => (
            <LessonCard key={lesson.title} index={index} lesson={lesson} />
          ))}
        </div>
      </div>
    </section>
  );
}
