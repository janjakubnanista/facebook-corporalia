import * as Swearwords from './swearwords';

const FACEBOOK_EMOTICON_URL_PATTERN = /^https:\/\/www\.facebook\.com\/images\/emoji\.php.*/i;

function getRandomSwearword() {
  const englishSwearwords = Swearwords.en;
  const randomIndex = Math.floor(Math.random() * englishSwearwords.length);
  const randomEnglishSwearword = englishSwearwords[randomIndex];

  return randomEnglishSwearword;
}

function emoticonNodeFilter(node) {
  const tagName = node.tagName.toLowerCase();
  if (tagName !== 'img') return NodeFilter.FILTER_SKIP;

  const src = node.getAttribute('src');
  if (!FACEBOOK_EMOTICON_URL_PATTERN.test(src)) return NodeFilter.FILTER_SKIP;

  return NodeFilter.FILTER_ACCEPT;
}

function replaceEmoticon(node, swearword) {
  if (!node || !node.parentNode) return;

  const replacement = document.createTextNode(swearword);
  node.parentNode.insertBefore(replacement, node);
  node.parentNode.removeChild(node);
}

function replaceEmoticons(node) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
    acceptNode: emoticonNodeFilter
  }, false);

  while (walker.nextNode()) {
    replaceEmoticon(walker.currentNode, getRandomSwearword());
  }
}

const observer = new WebKitMutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(replaceEmoticons);
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

replaceEmoticons(document.body);
