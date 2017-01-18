import q from 'q';

/* global chrome */
export default {
  get() {
    const deferred = q.defer();

    chrome.storage.sync.get({
      enabled: true,
      language: 'auto'
    }, response => deferred.resolve(response));

    return deferred.promise;
  },
  set(settings) {
    const deferred = q.defer();

    chrome.storage.sync.set(settings, () => deferred.resolve());

    return deferred.promise;
  }
};
