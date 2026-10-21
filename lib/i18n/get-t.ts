import { cookies } from "next/headers";
import { messages, type MessageId } from "./messages/catalog";
import { LOCALE_COOKIE, parseLocale, type Locale } from "./locale";
import { translate, type Vars } from "./translate";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  return parseLocale(jar.get(LOCALE_COOKIE)?.value);
}

export async function getT() {
  const locale = await getLocale();
  const dictionary = messages[locale];
  return (id: MessageId, vars?: Vars) => translate(dictionary, id, vars);
}
