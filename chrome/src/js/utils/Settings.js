import q from 'q';

/* global chrome, browser */
const getStorage = () => {
  const root = window.chrome || window.browser;
  const storage = root && root.storage && root.storage.local;

  return storage || null;
};

const storage = getStorage();

export default {
  areAvailable() {
    return !!storage;
  },
  get() {
    const deferred = q.defer();

    storage.get({
      enabled: true,
      language: 'auto'
    }, response => deferred.resolve(response));

    return deferred.promise;
  },
  set(settings) {
    const deferred = q.defer();

    storage.set(settings, () => deferred.resolve());

    return deferred.promise;
  }
};
