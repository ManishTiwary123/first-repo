import { getTranslation, LOCALE_CODES, type Locale } from "@/lib/i18n";
import { getUrlGeo } from "@/lib/geo";
import { PLATFORM_LOCALE_NOTICE, isPlatformLocale } from "@/lib/platform/pages";
import type { PlatformContext } from "./parts";

/**
 * Builds what every Factory Graph page needs from the URL: link base, the
 * site-wide copy (contact details), the market's name for the form, and the
 * "English only" notice on a locale the page is not written in.
 *
 * `getUrlGeo` reads only the country segment, never request headers, so the
 * page stays deterministic per URL.
 */
export function getPlatformContext(country: string, rawLocale: string): PlatformContext {
  const locale: Locale = LOCALE_CODES.includes(rawLocale as Locale) ? (rawLocale as Locale) : "en";
  return {
    base: `/${country}/${locale}`,
    country,
    locale,
    // English, like the page body and its form.
    countryName: getUrlGeo(country, "en").countryName,
    t: getTranslation(locale),
    notice: isPlatformLocale(locale) ? undefined : PLATFORM_LOCALE_NOTICE[locale],
  };
}
