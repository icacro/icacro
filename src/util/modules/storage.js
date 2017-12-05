const storage = () => {
  const fallBack = {
    storage: {},
    setItem(key, value) {
      this.storage[key] = value;
    },
    getItem(key) {
      return this.storage[key];
    },
  };
  const chooseStorage = (typeOfStorage) => {
    try {
      if (typeOfStorage in window && window[typeOfStorage] !== null) {
        return window[typeOfStorage];
      }
      return fallBack;
    } catch (e) {
      return false;
    }
  };

  return {
    setUp(typeOfStorage = 'sessionStorage') {
      const storageType = chooseStorage(typeOfStorage);
      return {
        set(key, value) {
          storageType.setItem(key, JSON.stringify(value));
        },
        get(key) {
          return JSON.parse(storageType.getItem(key));
        },
        remove(key) {
          storageType.removeItem(key);
        },
      };
    },
  };
};

const db = storage();
export default db.setUp();
