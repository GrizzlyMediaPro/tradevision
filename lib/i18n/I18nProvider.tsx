"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { messages, type MessageId } from "./messages/catalog";
import { LOCALE_COOKIE, type Locale } from "./locale";
import { translate, type Vars } from "./translate";

type I18nContextValue = {
  locale: Locale;
  t: (id: MessageId, vars?: Vars) => string;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(locale);

  useEffect(() => {
    setCurrent(locale);
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === current) return;
      writeLocaleCookie(next);
      setCurrent(next);
      router.refresh();
    },
    [current, router],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale: current,
      t: (id, vars) => translate(messages[current], id, vars),
      setLocale,
    }),
    [current, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

export function useT() {
  return useI18n().t;
}
