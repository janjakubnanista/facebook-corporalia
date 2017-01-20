import q from 'q';

export default class DummyLanguageDetector {
  constructor(languageCode) {
    this.__languageCodePromise = q(languageCode);
  }
  detect() {
    return this.__languageCodePromise;
  }
}
