﻿(function () {
    var IndexedDbDataAdapter = WinJS.Class.define(
        function (objectStoreName, createOptions, cursorOptions) {
            this._objectStoreName = objectStoreName;

            createOptions.databaseName = createOptions.databaseName || "myDatabase";
            createOptions.databaseVersion = createOptions.databaseVersion || 1;
            createOptions.keyPath = createOptions.keyPath || "id";
            createOptions.indexNames = createOptions.indexNames || [];
            this._createOptions = createOptions;

            if (cursorOptions) {
                cursorOptions.direction = cursorOptions.direction || "next";
            }
            this._cursorOptions = cursorOptions;
        },

		// Metodos de IListDataAdapter
        {
            getCount: function () {
                var that = this;
                return new WinJS.Promise(function (complete, error) {
                    that._getObjectStore().then(function (store) {
                        var reqCount;
                        if (that._cursorOptions) {
                            var cursorOptions = that._cursorOptions;
                            var index = store.index(cursorOptions.indexName);
                            var keyRange = that._createKeyRange(cursorOptions);
                            reqCount = index.count(keyRange);
                        } else {
                            reqCount = store.count();
                        }
                        reqCount.onerror = that._error;
                        reqCount.onsuccess = function (evt) {
                            complete(evt.target.result);
                        };
                    });
                });
            },


            itemsFromIndex: function (requestIndex, countBefore, countAfter) {
                var that = this;
                return new WinJS.Promise(function (complete, error) {
                    that.getCount().then(function (count) {
                        if (requestIndex >= count) {
                            return WinJS.Promise.wrapError(new WinJS.ErrorFromName(WinJS.UI.FetchError.doesNotExist));
                        }
                        var startIndex = Math.max(0, requestIndex - countBefore);
                        var endIndex = Math.min(count, requestIndex + countAfter + 1);

                        that._getObjectStore().then(function (store) {
                            var currentIndex = 0;
                            var items = [];
                            var req;

                            if (that._cursorOptions) {
                                var cursorOptions = that._cursorOptions;
                                var index = store.index(cursorOptions.indexName);
                                var keyRange = that._createKeyRange(cursorOptions);
                                req = index.openCursor(keyRange, cursorOptions.direction);
                            } else {
                                req = store.openCursor();
                            }
                            req.onerror = that._error;
                            req.onsuccess = function (evt) {
                                var cursor = evt.target.result;

                                if (currentIndex < startIndex) {
                                    currentIndex = startIndex;
                                    cursor.advance(startIndex);
                                    return;
                                }

                                if (cursor && currentIndex < endIndex) {
                                    currentIndex++;
                                    items.push({
                                        key: cursor.value[store.keyPath].toString(),
                                        data: cursor.value
                                    });
                                    cursor.continue();
                                    return;
                                }

                                results = {
                                    items: items,
                                    offset: requestIndex - startIndex,
                                    totalCount: count
                                };
                                complete(results);
                            };
                        });
                    });
                });
            },


            insertAtEnd:function(unused, data) {
                var that = this;
                return new WinJS.Promise(function (complete, error) {
                    that._getObjectStore("readwrite").done(function(store) {
                        var reqAdd = store.add(data);
                        reqAdd.onerror = that._error;
                        reqAdd.onsuccess = function (evt) {
                            var reqGet = store.get(evt.target.result);
                            reqGet.onerror = that._error;
                            reqGet.onsuccess = function (evt) {
                                var newItem = {
                                    key:evt.target.result[store.keyPath].toString(),
                                    data:evt.target.result
                                }
                                complete(newItem);
                            };
                        };
                    });
                });
            },


            remove:function(key) {
                var that = this;
                return new WinJS.Promise(function (complete, error) {
                    that._getObjectStore("readwrite").done(function (store) {
                        key = parseInt(key);
                        var reqDelete = store.delete (key);
                        reqDelete.onerror = that._error;
                        reqDelete.onsuccess = function (evt) {
                            complete();
                        };
                    });
                });
            },



            change: function (key, data, indexHint) {
                var that = this;
                return new WinJS.Promise(function (complete, error) {
                    that._getObjectStore("readwrite").done(function (store) {
                        key = parseInt(key);
                        var unwrappedData = WinJS.Binding.unwrap(data);
                        var reqPut = store.put (unwrappedData);
                        reqPut.onerror = that._error;
                        reqPut.onsuccess = function (evt) {
                            complete();
                        };
                    });
                });
            },


            setNotificationHandler: function (notificationHandler) {
                this._notificationHandler = notificationHandler;
            },

			// Metodos propios
            nuke: function () {
                var that = this;
                return new WinJS.Promise(function (complete, error) {
                    that._getObjectStore("readwrite").done(function (store) {
                        var reqClear = store.clear();
                        reqClear.onerror = that._error;
                        reqClear.onsuccess = function (evt) {
                            that._notificationHandler.reload();
                            complete();
                        };
                    });
                });
            },

			// Metodos privados
            _ensureDbOpen: function () {
                var that = this;
                
                if (that._cachedDb) {
                    return WinJS.Promise.wrap(that._cachedDb);
                }

                return new WinJS.Promise(function (complete, error, progress) {
                    var createOptions = that._createOptions;
                    var reqOpen = window.indexedDB.open(createOptions.databaseName, createOptions.databaseVersion);
                    reqOpen.onerror = that._error;
                    reqOpen.onsuccess = function () {
                        that._cachedDb = reqOpen.result;
                        complete(that._cachedDb);
                    };

                    reqOpen.onupgradeneeded = function (evt) {
                        var newDB = evt.target.result;

                        var store = newDB.createObjectStore(that._objectStoreName,
                            {
                                keyPath: createOptions.keyPath,
                                autoIncrement: true
                            });

                        for (var i = 0; i < createOptions.indexNames.length; i++) {
                            var indexName = createOptions.indexNames[i];
                            store.createIndex(indexName, indexName);
                        }
                    }
                });
            },


            _getObjectStore: function (type) {
                type = type || "readonly";
                var that = this;
                return new WinJS.Promise(function (complete, error) {
                    that._ensureDbOpen().then(function (db) {
                        var transaction = db.transaction(that._objectStoreName, type);
                        var store = transaction.objectStore(that._objectStoreName);
                        complete(store);
                    });
                });
            },

            _get: function (key) {
                return new WinJS.Promise(function (complete, error) {
                    that._getObjectStore().done(function (store) {
                        var reqGet = store.get(key);
                        reqGet.onerror = that._error;
                        reqGet.onsuccess = function (item) {
                            complete(item);
                        };
                    });
                });
            },


            _createKeyRange: function (cursorOptions) {
                if (cursorOptions.only) {
                    return IDBKeyRange.only(cursorOptions.only);
                } else if (cursorOptions.lowerBound && cursorOptions.upperBound) {
                    return IDBKeyRange.bound(cursorOptions.lower, cursorOptions.upperBound);
                } else if (cursorOptions.upperBound) {
                    return IDBKeyRange.upperBound(cursorOptions.upperBound);
                } else if (cursorOptions.lowerBound) {
                    return IDBKeyRange.lowerBound(cursorOptions.lowerBound);
                }
                return null;
            },

            _error: function (evt) {
                console.log(evt);
            }


        }
    );

    var IndexedDbDataSource = WinJS.Class.derive(
        WinJS.UI.VirtualizedDataSource,
        function (objectStoreName, createOptions, cursorOptions) {
            this._adapter = new IndexedDbDataAdapter(objectStoreName, createOptions, cursorOptions);
            this._baseDataSourceConstructor(this._adapter);
        },
        {
            get: function(key, index) {
                return this._adapter.get(key, index);
            },
            nuke: function () {
                return this._adapter.nuke();
            }
        }
    );

    WinJS.Namespace.define("DataSources", {
        IndexedDbDataSource: IndexedDbDataSource
    });

})();
