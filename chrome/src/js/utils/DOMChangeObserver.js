const MutationObserverImplemenation = MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

export default class DOMChangeObserver {
  constructor(replacer) {
    this.onNodeAdded = this.onNodeAdded.bind(this);

    this.__replacer = replacer;
    this.__observer = new MutationObserverImplemenation(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(this.onNodeAdded);
      });
    });
  }
  onNodeAdded(node) {
    this.__replacer.replaceWithin(node);
  }
  observe() {
    this.__observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}
