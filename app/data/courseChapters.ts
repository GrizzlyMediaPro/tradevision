export type CourseChapter = {
  title: string;
  description: string;
  videoId: string;
  lessonLabel?: string;
};

export const defaultCourseChapters: CourseChapter[] = [
  {
    title: "course.fallback.1.title",
    description: "course.fallback.1.description",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "course.fallback.2.title",
    description: "course.fallback.2.description",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "course.fallback.3.title",
    description: "course.fallback.3.description",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "course.fallback.4.title",
    description: "course.fallback.4.description",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "course.fallback.5.title",
    description: "course.fallback.5.description",
    videoId: "dQw4w9WgXcQ",
  },
];

export const COURSE_CHAPTERS_STORAGE_KEY = "tradevision_course_chapters_v1";

