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

  const api = {
    setUp(storageName, typeOfStorage) {
      const storageType = chooseStorage(typeOfStorage);
      return {
        set(key, value) {
          storageType.setItem(storageName, JSON.stringify({ [key]: value }));
        },
        get(key) {
          return JSON.parse(storageType.getItem(storageName))[key];
        },
      };
    },
  };
  return {
    setUp(storageName = 'cro-cookie', typeOfStorage = 'sessionStorage') {
      const storageApi = api.setUp(storageName, typeOfStorage);
      return {
        set(key, value) {
          storageApi.set(key, value);
        },
        get(key) {
          return storageApi.get(key);
        },
      };
    },
  };
};

const db = storage();
export default db.setUp();
