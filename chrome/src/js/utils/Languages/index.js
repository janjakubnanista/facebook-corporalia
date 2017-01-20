import Settings from 'utils/Settings';

import cs from './lang/cs';
import en_gb from './lang/en-gb';
import en_us from './lang/en-us';
import es from './lang/es';
import nl from './lang/nl';
import sk from './lang/sk';

const ALL = [
  cs,
  en_gb,
  en_us,
  es,
  nl,
  sk
];

function getAvailable() {
  return ALL.slice();
}

function getSelectedLanguageCode() {
  return Settings.get().then(({ language }) => language);
}

function find(languageCode) {
  if (!languageCode) return null;

  const normalisedLanguageCode = languageCode.toLowerCase().replace('_', '-');
  const exactMatch = ALL.find(({ code }) => code === normalisedLanguageCode);
  if (exactMatch) return exactMatch;

  const [majorLanguageCode] = normalisedLanguageCode.split(/-/);
  const majorMatch = ALL.find(({ code }) => code.split('-').shift() === majorLanguageCode);
  if (majorMatch) return majorMatch;

  return null;
}

function getFacebookLanguageCode() {
  return document.documentElement.getAttribute('lang');
}

function getBrowserLanguageCode() {
  return navigator.language;
}

function getFallbackLanguageCode() {
  return 'en-gb';
}

function getFirstSupportedFallbackLanguageCode() {
  const facebookLanguageCode = getFacebookLanguageCode();
  const browserLanguageCode = getBrowserLanguageCode();
  const fallbackLanguageCode = getFallbackLanguageCode();
  const languageCodes = [facebookLanguageCode, browserLanguageCode, fallbackLanguageCode];

  return languageCodes.find(languageCode => !!find(languageCode));
}

export default {
  find,
  getAvailable,
  getBrowserLanguageCode,
  getFacebookLanguageCode,
  getFallbackLanguageCode,
  getSelectedLanguageCode,
  getFirstSupportedFallbackLanguageCode
};
