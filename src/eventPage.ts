class dataDungeon {
    openDatabase(callback, onUpgradeNeeded) {
        let request = indexedDB.open("liam_store", 1);

        request.onerror = function(event) {
            console.log("Can't connect to database: " + event.target.errorCode);
            if (callback) {
                callback(null);
            }
        };

        request.onsuccess = (event) => {
            let db = event.target.result;
            db.onerror = (errorEvent) => {
                console.log("(data open) error: ");
                console.log(errorEvent);
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
                console.log("(save) added item: " + item.host);
                callback(item);
            }

        }, null);
    }

    getItem(item, callback) {
        this.openDatabase((db) => {
            let request = db.transaction('sitesAllowed', 'readonly').objectStore('sitesAllowed').get(item);
            request.onsuccess = (event) => {
                console.log("queried and got back: " + event.target.result);
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
}

let database = new dataDungeon();

var lastRequest = null;
var host = null;

/**
 * param 1: callable with request
 * param 2: object for filters
 * param 3: extraInfo
 */
chrome.webNavigation.onBeforeNavigate.addListener((requestDetails) => 
{
    // NOTE: This will search for top level frames with the value -1.
    if (requestDetails.parentFrameId != -1) {
        return;
    }
    
     let url = new URL(requestDetails.url);
        let splitUrl = url.hostname.split('.');
        // Note: Need to consider for XX.co.uk might have to include autisticly long list.
        // Note: will be in the form xx.xxx.xxxx.com only concerned about second to last (host).
        host = (splitUrl[(splitUrl.length -1) - 1]);
        if (host == null) {
            return;
        }
        database.getItem(host, (result) => {
            if (!result) {
                let warnPage = chrome.extension.getURL('./views/yellow.html');
                lastRequest = requestDetails.url;
                console.log(lastRequest);
                chrome.tabs.update({url: warnPage});
            }
        });
},
    {urls: ["<all_urls>"]},
    ["blocking"]
);

var saveItem = function(uri) {
    console.log(uri);
    let entry = {host: host};
    let saved = database.saveItem(entry, (entry) => {});
    chrome.tabs.update({url: uri});
};

chrome.runtime.onInstalled.addListener((details) => {
    // prepopulate database with top 100
});
