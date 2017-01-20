import DOMChangeObserver from 'utils/DOMChangeObserver';
import DummyLanguageDetector from 'utils/DummyLanguageDetector';
import EmojiReplacer from 'utils/EmojiReplacer';
import LanguageDetector from 'utils/LanguageDetector';
import Languages from 'utils/Languages';
import Settings from 'utils/Settings';
import WordGenerator from 'utils/WordGenerator';

function checkEnabled() {
  return Settings.get().then(({ enabled }) => enabled);
}

function getLanguageDetector() {
  return Languages.getSelectedLanguageCode().then(languageCode => {
    if (languageCode === 'auto') {
      const defaultLanguageCode = Languages.getFirstSupportedFallbackLanguageCode();

      return new LanguageDetector(defaultLanguageCode);
    }

    return new DummyLanguageDetector(languageCode);
  });
}

function reportError(error) {
  console.error('Mean Facebook addon has crashed!'); // eslint-disable-line no-console

  if (error) {
    console.error('Error details:'); // eslint-disable-line no-console
    console.error(error.message); // eslint-disable-line no-console
    console.error(error.stack); // eslint-disable-line no-console
  }
}

// First check if the storage (chrome.storage.local or browser.storage.local)
// is available. If not just exit screaming
if (!Settings.areAvailable()) {
  throw new Error('Mean Facebook addon needs storage API in order to work');
}

checkEnabled()
  .then(enabled => {
    if (!enabled) return null;

    return getLanguageDetector().then(detector => {
      const generator = new WordGenerator();
      const replacer = new EmojiReplacer(detector, generator);
      const observer = new DOMChangeObserver(replacer);

      replacer.replaceWithin(document.body);
      observer.observe();
    });
  })
  .done(null, reportError);
