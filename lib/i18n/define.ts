export function defineBundle<const T extends Record<string, string>>(
  en: T,
  ro: { [K in keyof T]: string },
) {
  return { en, ro };
}
