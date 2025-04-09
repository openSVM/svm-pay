import { i18n } from "~/config/i18n-config";

export const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  zh: () => import("./dictionaries/zh.json").then((module) => module.default),
  de: () => import("./dictionaries/de.json").then((module) => module.default),
  vi: () => import("./dictionaries/vi.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  if (!i18n.locales.includes(locale as any)) locale = i18n.defaultLocale;
  return dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en();
};
