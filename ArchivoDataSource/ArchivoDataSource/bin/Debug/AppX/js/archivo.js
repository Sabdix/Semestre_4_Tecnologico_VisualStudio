(function () {

    // Definir la clase y heredar de IListDataAdapter.
    var FileDataAdapter = WinJS.Class.define(
        // Constructor
        function (fileName) {
            this._fileName = fileName;
        },

        // Metodos de instancia
        {

            // Metodos de IListDataAdapter

            getCount: function () {
                var that = this;

                return new WinJS.Promise(function (complete, error) {
                    that._ensureData().done(function (data) {
                        complete(data.items.length);
                    });
                });
            },


            itemsFromIndex: function (requestIndex, countBefore, countAfter) {
                var that = this;

                return new WinJS.Promise(function (complete, error) {
                    var startIndex = Math.max(0, requestIndex - countBefore);
                    that._ensureData().then(
                        function (data) {
                            var subItems = data.items.slice(startIndex);
                            complete({
                                items: subItems,
                                offset: requestIndex - startIndex,
                                totalCount: data.items.length
                            });

                        });
                });
            },




            insertAtEnd: function (unused, newItem) {
                var that = this;
                return new WinJS.Promise(function (complete, error) {
                    that._ensureData().then(function (data) {
                        var newKey = (++data.maxKey).toString();
                        data.items.push({
                            key: newKey,
                            data: newItem
                        });
                        that._saveData(data).then(function () {
                            complete({
                                key: newKey,
                                data: newItem
                            });
                        });
                    });
                });
            },


            change: function (key, changedData, indexHint) {
                var that = this;
                return new WinJS.Promise(function (complete, error) {
                    that._ensureData().then(function (data) {
                        var i = that._getIndexFromKey(data.items, key);
                        var changedItem = {
                            key: key,
                            index: indexHint,
                            data: changedData
                        };
                        data.items[i] = changedItem;
                        that._saveData(data).then(function () {
                            complete();
                        });
                    });
                });
            },


            remove: function (key) {
                var that = this;
                return that._ensureData().then(function (data) {
                    var i = that._getIndexFromKey(data.items, key);
                    data.items.splice(i, 1);
                    return that._saveData(data);
                });
            },


            setNotificationHandler: function (notificationHandler) {
                this._notificationHandler = notificationHandler;
            },

            // Otros metodos
            nuke: function () {
                var that = this;
                return new WinJS.Promise(function (complete, error) {
                    var local = WinJS.Application.local;
                    return local.remove(that._fileName).done(function () {
                        that._cachedData = null;
                        that._notificationHandler.reload();
                    });
                });
            },


            // Metodos privados
            _ensureData: function () {
                var that = this;

                // Retornar los datos en cache
                if (this._cachedData) {
                    return WinJS.Promise.wrap(that._cachedData);
                }

                // Cargar de archivo
                return new WinJS.Promise(function (complete, error) {
                    var local = WinJS.Application.local;
                    var def = '{"maxKey":-1,"items":[]}';
                    local.readText(that._fileName, def).done(function (fileContents) {
                        that._cachedData = JSON.parse(fileContents);
                        complete(that._cachedData);
                    });
                });
            },


            _saveData: function (data) {
                this._cachedData = data;
                var local = WinJS.Application.local;
                var str = JSON.stringify(data);
                return local.writeText(this._fileName, str);
            },


            _getIndexFromKey: function (items, key) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].key === key) {
                        return i;
                    }
                }
            }


        }
    );

    var FileDataSource = WinJS.Class.derive(
        WinJS.UI.VirtualizedDataSource,
        function (fileName) {
            this._adapter = new FileDataAdapter(fileName);
            this._baseDataSourceConstructor(this._adapter);
        },
        {
            nuke: function () {
                this._adapter.nuke();
            }
        }
    );

    WinJS.Namespace.define("DataSources", {
        FileDataSource: FileDataSource
    });

})();
