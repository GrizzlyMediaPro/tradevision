export type CourseChapter = {
  title: string;
  description: string;
  videoId: string;
};

export const defaultCourseChapters: CourseChapter[] = [
  {
    title: "Capitolul 1: Introducere în Trading",
    description:
      "Învață bazele trading-ului, ce este piața financiară, cum funcționează bursele și ce înseamnă să fii trader. Acest capitol îți oferă fundamentele de care ai nevoie pentru a înțelege restul cursului.",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Capitolul 2: Analiza Tehnică",
    description:
      "Descoperă principiile analizei tehnice: suport și rezistență, trend-uri, formațiuni de preț și indicatori tehnici esențiali pe care orice trader trebuie să-i cunoască.",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Capitolul 3: Managementul Riscului",
    description:
      "Cel mai important capitol. Învață cum să-ți protejezi capitalul, cum să setezi stop-loss-uri corecte, cum să calculezi dimensiunea poziției și reguli esențiale de money management.",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Capitolul 4: Psihologia Trading-ului",
    description:
      "Trading-ul este 80% psihologie. Înțelege emoțiile care te sabotează, cum să-ți dezvolți disciplina și cum să iei decizii raționale sub presiune.",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Capitolul 5: Strategii de Trading",
    description:
      "Pune totul cap la cap. Învață strategii concrete de intrare și ieșire din piață, cum să-ți construiești un plan de trading și cum să-ți evaluezi performanța.",
    videoId: "dQw4w9WgXcQ",
  },
];

export const COURSE_CHAPTERS_STORAGE_KEY = "tradevision_course_chapters_v1";

