import q from 'q';

import Languages from 'utils/Languages';
import Settings from 'utils/Settings';
import WordGenerator from 'utils/WordGenerator';

const FACEBOOK_EMOTICON_URL_PATTERN = /^https:\/\/www\.facebook\.com\/images\/emoji\.php.*/i;

function emoticonNodeFilter(node) {
  const tagName = node.tagName.toLowerCase();
  if (tagName !== 'img') return NodeFilter.FILTER_SKIP;

  const src = node.getAttribute('src');
  if (!FACEBOOK_EMOTICON_URL_PATTERN.test(src)) return NodeFilter.FILTER_SKIP;

  return NodeFilter.FILTER_ACCEPT;
}

function replaceTextEmoticon(node, word) {
  if (!node || !node.parentNode || !node.parentNode.parentNode) return;

  const replacement = document.createElement('span');
  replacement.appendChild(document.createTextNode(` ${word} `));

  const sibling = node.nextSibling;
  const parent = node.parentNode;
  const isWrapped = parent.childNodes.length === 2 && sibling instanceof HTMLElement && sibling.tagName.toLowerCase() === 'span';

  const wrapper = isWrapped ? node.parentNode : node;
  wrapper.parentNode.insertBefore(replacement, wrapper);
  wrapper.parentNode.removeChild(wrapper);
}

function replaceTextEmoticons(node, generator) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
    acceptNode: emoticonNodeFilter
  }, false);

  const emoticonNodes = [];
  while (walker.nextNode()) {
    emoticonNodes.push(walker.currentNode);
  }

  emoticonNodes.forEach(emoticonNode => replaceTextEmoticon(emoticonNode, generator.next()));
}

function ensureEnabled() {
  return Settings.get().then(({ enabled }) => {
    if (!enabled) return q.reject();
  });
}

function getLanguage() {
  return Languages.getSelected().then(selectedLanguageCode => {
    if (selectedLanguageCode === 'auto') return Languages.detect(document);

    return Languages.find(selectedLanguageCode);
  });
}

function initialize(language) {
  const MutationObserverImplemenation = MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  const generator = new WordGenerator(language.code);
  const observer = new MutationObserverImplemenation(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => replaceTextEmoticons(node, generator));
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  replaceTextEmoticons(document.body, generator);
}

function reportError(error) {
  console.error('Mean Facebook addon has failed with an error:'); // eslint-disable-line no-console
  console.error(error); // eslint-disable-line no-console
}

ensureEnabled()
  .then(getLanguage)
  .then(initialize, reportError);
