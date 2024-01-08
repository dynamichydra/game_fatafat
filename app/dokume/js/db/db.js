class IndexedDBWrapper {
  constructor(databaseName, databaseVersion) {
    this.databaseName = databaseName;
    this.databaseVersion = databaseVersion;
    this.db = null;
    this.isOpen = false;
    this.openPromise = null;
  }

  openDatabase(objectStores) {
    if (this.openPromise) {
      return this.openPromise;
    }

    this.openPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, this.databaseVersion);

      request.onerror = function (event) {
        reject(event.target.error);
      };

      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        const existingObjectStoreNames = Array.from(db.objectStoreNames);

        objectStores.forEach((config) => {
          const { storeName, keyPath, indexes } = config;

          if (!existingObjectStoreNames.includes(storeName)) {
            const objectStore = db.createObjectStore(storeName, { keyPath });

            if (indexes) {
              indexes.forEach((index) => {
                objectStore.createIndex(index.name, index.keyPath, index.options);
              });
            }
          }
        });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.isOpen = true;
        resolve();
      };
    });

    return this.openPromise;
  }

  async createObjectStore(storeName, keyPath, indexes = []) {
    await this.waitForOpenDatabase();

    if (!this.db.objectStoreNames.contains(storeName)) {
      const objectStore = this.db.createObjectStore(storeName, { keyPath });

      indexes.forEach((index) => {
        objectStore.createIndex(index.name, index.keyPath, index.options);
      });

      return objectStore;
    }
  }

  async getObject(storeName, key) {
    await this.waitForOpenDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName);
      const store = transaction.objectStore(storeName);

      if (key) {
        const request = store.get(key);

        request.onerror = function (event) {
          reject(event.target.error);
        };

        request.onsuccess = function (event) {
          const object = event.target.result;
          resolve(object);
        };
      } else {
        const request = store.getAll();

        request.onerror = function (event) {
          reject(event.target.error);
        };

        request.onsuccess = function (event) {
          const objects = event.target.result;
          resolve(objects);
        };
      }
    });
  }

  async saveObject(storeName, key, data) {
    await this.waitForOpenDatabase();

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return Promise.resolve();
      } else if (data[0].id) {
        return this.updateObjects(storeName, data);
      } else {
        return this.addObjects(storeName, data);
      }
    } else if (key) {
      return this.updateObject(storeName, key, data);
    } else {
      return this.addObject(storeName, data);
    }
  }

  async addObject(storeName, object) {
    await this.waitForOpenDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(object);

      request.onerror = function (event) {
        reject(event.target.error);
      };

      transaction.oncomplete = function () {
        resolve();
      };
    });
  }

  async addObjects(storeName, objects) {
    await this.waitForOpenDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const objectStore = transaction.objectStore(storeName);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event) => {
        reject(event.target.error);
      };

      objects.forEach((object) => {
        const request = objectStore.add(object);

        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    });
  }

  async updateObject(storeName, key, updatedObject) {
    await this.waitForOpenDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(key);

      getRequest.onsuccess = function (event) {
        const object = event.target.result;
        if (object) {
          // Update the object with new values
          Object.assign(object, updatedObject);
          const putRequest = store.put(object);

          putRequest.onerror = function (event) {
            reject(event.target.error);
          };

          putRequest.onsuccess = function () {
            resolve();
          };
        } else {
          reject(new Error("Object not found."));
        }
      };

      getRequest.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  async updateObjects(storeName, objects) {
    await this.waitForOpenDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const updateNext = (index) => {
        if (index >= objects.length) {
          resolve();
          return;
        }

        const object = objects[index];
        const getRequest = store.get(object.id);

        getRequest.onsuccess = function (event) {
          const existingObject = event.target.result;
          if (existingObject) {
            // Update the object with new values
            Object.assign(existingObject, object);
            const putRequest = store.put(existingObject);

            putRequest.onerror = function (event) {
              reject(event.target.error);
            };

            putRequest.onsuccess = function () {
              updateNext(index + 1);
            };
          } else {
            reject(new Error("Object not found."));
          }
        };

        getRequest.onerror = function (event) {
          reject(event.target.error);
        };
      };

      updateNext(0);
    });
  }

  async deleteObject(storeName, key) {
    await this.waitForOpenDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = function (event) {
        reject(event.target.error);
      };

      request.onsuccess = function () {
        resolve();
      };
    });
  }

  async deleteObjects(storeName, keys) {
    await this.waitForOpenDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const deleteNext = (index) => {
        if (index >= keys.length) {
          resolve();
          return;
        }

        const key = keys[index];
        const request = store.delete(key);

        request.onerror = function (event) {
          reject(event.target.error);
        };

        request.onsuccess = function () {
          deleteNext(index + 1);
        };
      };

      deleteNext(0);
    });
  }

  async clear(storeName) {
    await this.waitForOpenDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.clear();

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event) => {
        reject(event.target.error);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async closeDatabase() {
    await this.waitForOpenDatabase();

    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async waitForOpenDatabase() {
    return new Promise((resolve) => {
      const checkDatabaseConnection = () => {
        if (this.db) {
          resolve();
        } else {
          setTimeout(checkDatabaseConnection, 100);
        }
      };

      checkDatabaseConnection();
    });
  }
}

/*
// Usage example:

const databaseName = "YourDatabase";
const databaseVersion = 1;
const objectStoreName = "YourObjectStore";

const dbWrapper = new IndexedDBWrapper(databaseName, databaseVersion);

dbWrapper
  .openDatabase()
  .then(() => {
    const indexes = [
      { name: "nameIndex", keyPath: "name", options: { unique: false } },
      { name: "ageIndex", keyPath: "age", options: { unique: false } },
    ];
    dbWrapper.createObjectStore(objectStoreName, "id", indexes); // Create object store with indexes
    return dbWrapper.addObject(objectStoreName, {
      id: 1,
      name: "John",
      age: 25,
    }); // Add an object
  })
  .then(() => {
    return dbWrapper.getObject(objectStoreName, 1); // Retrieve the object
  })
  .then((object) => {
    console.log(object); // { id: 1, name: 'John', age: 25 }
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  })
  .finally(() => {
    dbWrapper.closeDatabase();
  });
*/