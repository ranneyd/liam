class dungeonDB {

    openDatabase(callback, onUpgradeNeeded) {
        let request = indexedDB.open("liam_store", 1);

        request.onerror = function(event) {
            console.log("Can't connect to database: " + event.target.errorCode);
            if (callback) {
                callback(null);
            }
        };

        request.onsuccess = (event) => {
            console.log(event);
            let db = event.target.result;
            db.onerror = (errorEvent) => {
                console.log("(data open) error: ");
                console.log(errorEvent);
                // NOTE: Exit here.
            }
            if (callback) {
                callback(db);
            }
        }

        request.onupgradeneeded = (event) => {
            console.log("upgrade needed");
            let db = event.target.result;
            if (db.version == 1) {
                if (onUpgradeNeeded) {
                    onUpgradeNeeded();
                }
            }

            let dataStore = db.createObjectStore('sitesAllowed', {keyPath: 'host'});
            // Note: This is a terrible indexing strategy.
            dataStore.createIndex('host', 'host', {unique: true});
            dataStore.transaction.oncomplete = (event) => {};
        };
    }

    saveItem(item, callback) {
        this.openDatabase((db) => {
            let transaction = db.transaction('sitesAllowed', 'readwrite');
            let itemStore = transaction.objectStore('sitesAllowed');
            
            transaction.oncomplete = (event) => {};
            
            transaction.onerror = (event) => {
                console.log("(save) Error: " + event);
            };
            
            itemStore.add(item).onsuccess = (event) => {
                console.log("(save) adding item: " + item.host);
                callback(item);
            }

        }, null);
    }

    getItem(item, callback) {
        this.openDatabase((db) => {
            let request = db.transaction('sitesAllowed', 'readonly').objectStore('sitesAllowed').get(item);
            request.onsuccess = (event) => {
                callback(event.target.result);
            };
        }, null);
    }

    getItems(callback) {
        this.openDatabase((db) => {
            let objectStore = db.transaction('sitesAllowed').objectStore('sitesAllowed');
            let index = objectStore.index('host');
            let items = [];
            index.openCursor().onsuccess = (event) => {
                let cursor = event.target.result;
                if (cursor) {
                    items.push(cursor.value);
                    cursor.continue();
                } else {
                    return callback(items);
                }
            };
        }, null);
    }

    deleteItem(item) {
        this.openDatabase((db) => {
            let request = db.transaction('sitesAllowed', 'readwrite').objecStore('sitesAllowed').delete(item.host);
            request.onsuccess = (event) => {
                console.log("successfully deleted item, " + item.host);
            };
        }, null);
    }

    deleteAll() {

    }
}

/**
 * param 1: callable with request
 * param 2: object for filters
 * param 3: extraInfo
 */
let database = new dungeonDB();

chrome.webRequest.onBeforeRequest.addListener(
    function(requestInfo) { 
        let url = new URL(requestInfo.url);
        let splitUrl = url.hostname.split('.');
        // Note: take into account foreign urls.
        // Note: will be in the form xx.xxx.xxxx.com only concerned about second to last (host).
        let host = (splitUrl[(splitUrl.length -1) - 1]);
        if (host == null) {
            return;
        }
        database.getItem(host, (result) => {
            console.log("queried and got back: ");
            console.log(result);
            if (!result) {
                console.log("could not find entry: " + host);
                let entry = {host: host};
                let saved = database.saveItem(entry, (result) => {
                    console.log("Current Database: ");
                    database.getItems((items) => {
                        console.log(items);
                    });
                });
            }
        });
    },
    {
        urls: ["<all_urls>"]
    },
    ["blocking"]
);
