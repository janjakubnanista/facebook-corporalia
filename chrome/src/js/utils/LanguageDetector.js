import q from 'q';

function isElementAContainer(element) {
  const isPost = element.classList.contains('userContent');
  if (isPost) return true;

  const isComment = element.classList.contains('UFICommentBody');
  if (isComment) return true;

  return false;
}

function findClosestContainer(element) {
  let currentElement = element;
  while (currentElement) {
    if (isElementAContainer(currentElement)) return currentElement;

    currentElement = currentElement.parentElement;
  }

  return null;
}

export default class LanguageDetector {
  constructor(defaultLanguageCode) {
    this.__defaultLanguageCode = defaultLanguageCode;
    this.__detectedLanguageByContent = {};
  }
  __getCachedLanguageCode(content) {
    return this.__detectedLanguageByContent[content];
  }
  __setCachedLanguageCode(content, languageCode) {
    this.__detectedLanguageByContent[content] = languageCode;
  }
  __detect(content) {
    const deferred = q.defer();

    window.chrome.i18n.detectLanguage(content, result => {
      const [language] = result.languages;
      const languageCode = language ? language.language : this.__defaultLanguageCode;

      deferred.resolve(languageCode);
    });

    return deferred.promise;
  }
  detect(element) {
    if (!LanguageDetector.isAvailable()) return q.resolve(this.__defaultLanguageCode);

    const container = findClosestContainer(element);
    if (!container) return q.resolve(this.__defaultLanguageCode);

    const content = container.textContent;
    const cachedLanguageCode = this.__getCachedLanguageCode(content);
    if (cachedLanguageCode) return q.resolve(cachedLanguageCode);

    return this.__detect(content).then(languageCode => {
      this.__setCachedLanguageCode(content, languageCode);

      return languageCode;
    });
  }
}

LanguageDetector.isAvailable = function() {
  return !!window.chrome && !!window.chrome.i18n;
};
