export type Vars = Record<string, string | number>;

export function translate(
  messages: Record<string, string>,
  id: string,
  vars?: Vars,
): string {
  const template = messages[id];
  if (template == null) return id;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key];
    return value == null ? match : String(value);
  });
}
