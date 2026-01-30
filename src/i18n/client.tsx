'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { locales, defaultLocale, type Locale, localeNames } from './config';
import nlMessages from './nl.json';
import frMessages from './fr.json';
import enMessages from './en.json';

type Messages = typeof nlMessages;

const messages: Record<Locale, Messages> = {
  nl: nlMessages,
  fr: frMessages,
  en: enMessages,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  locales: readonly Locale[];
  localeNames: Record<Locale, string>;
}

function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return key if not found
    }
  }
  return typeof result === 'string' ? result : path;
}

// Default translation function for SSR
const defaultT = (key: string): string => getNestedValue(messages[defaultLocale], key);

// Default context value (used during SSR and initial render)
const defaultContextValue: I18nContextType = {
  locale: defaultLocale,
  setLocale: () => {},
  t: defaultT,
  locales,
  localeNames,
};

const I18nContext = createContext<I18nContextType>(defaultContextValue);

const LOCALE_COOKIE = 'REVABRAIN_LOCALE';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  // Load locale from cookie on mount
  useEffect(() => {
    const savedLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))
      ?.split('=')[1] as Locale | undefined;

    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    if (locales.includes(newLocale)) {
      setLocaleState(newLocale);
      // Save to cookie (1 year expiry)
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
  };

  const t = (key: string): string => {
    return getNestedValue(messages[locale], key);
  };

  // Always provide context, even during hydration
  // This prevents SSR errors while maintaining functionality
  const value: I18nContextType = mounted
    ? { locale, setLocale, t, locales, localeNames }
    : defaultContextValue;

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  return useContext(I18nContext);
}

// Language switcher component
export function LanguageSwitcher() {
  const { locale, setLocale, locales: locs } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render interactive buttons until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-1">
        {locs.map((loc, index) => (
          <span key={loc}>
            {index > 0 && <span className="text-slate-400 mx-1">|</span>}
            <span className="text-sm text-slate-600">{loc.toUpperCase()}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {locs.map((loc, index) => (
        <span key={loc}>
          {index > 0 && <span className="text-slate-400 mx-1">|</span>}
          <button
            onClick={() => setLocale(loc)}
            className={`text-sm transition-colors ${
              locale === loc
                ? 'font-semibold text-[#2879D8]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
