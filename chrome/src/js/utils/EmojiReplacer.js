const FACEBOOK_EMOTICON_URL_PATTERN = /^https:\/\/(www\.facebook\.com|static\.xx\.fbcdn\.net)\/images\/emoji\.php.*/i;

function emoticonNodeFilter(node) {
  const tagName = node.tagName.toLowerCase();
  if (tagName !== 'img') return NodeFilter.FILTER_SKIP;

  const src = node.getAttribute('src');
  if (!FACEBOOK_EMOTICON_URL_PATTERN.test(src)) return NodeFilter.FILTER_SKIP;

  return NodeFilter.FILTER_ACCEPT;
}

export default class EmojiReplacer {
  constructor(languageDetector, wordGenerator) {
    this.__languageDetector = languageDetector;
    this.__wordGenerator = wordGenerator;
  }
  replace(element) {
    return this.__languageDetector.detect(element).done(languageCode => {
      if (!element.parentNode || !element.parentNode.parentNode) return;

      const word = this.__wordGenerator.next(languageCode);
      const replacement = document.createElement('span');
      replacement.appendChild(document.createTextNode(` ${word} `));

      const sibling = element.nextSibling;
      const parent = element.parentNode;
      const isWrapped = parent.childNodes.length === 2 && sibling instanceof HTMLElement && sibling.tagName.toLowerCase() === 'span';

      const wrapper = isWrapped ? element.parentNode : element;
      wrapper.parentNode.insertBefore(replacement, wrapper);
      wrapper.parentNode.removeChild(wrapper);
    });
  }
  replaceWithin(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
      acceptNode: emoticonNodeFilter
    }, false);

    const emoticonNodes = [];
    while (walker.nextNode()) emoticonNodes.push(walker.currentNode);

    emoticonNodes.forEach(emoticonNode => this.replace(emoticonNode));
  }
}
