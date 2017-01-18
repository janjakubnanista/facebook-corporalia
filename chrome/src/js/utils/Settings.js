import q from 'q';

/* global chrome, browser */
const storage = () => chrome.storage || browser.storage;

export default {
  get() {
    const deferred = q.defer();

    storage().local.get({
      enabled: true,
      language: 'auto'
    }, response => deferred.resolve(response));

    return deferred.promise;
  },
  set(settings) {
    const deferred = q.defer();

    storage().local.set(settings, () => deferred.resolve());

    return deferred.promise;
  }
};
