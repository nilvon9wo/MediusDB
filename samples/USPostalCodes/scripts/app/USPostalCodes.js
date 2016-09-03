/* global MediusStatus, cities, MediusEvent, MediusDB, MediusHttp */

var DATABASE = {NAME: 'postalCodes', VERSION: 64};
var LOCATIONS = {STORENAME: 'locations', VERSION: 5};

function insertZipcodes(database, callback) {
    'use strict';
    var statusLine = MediusStatus.createStatus('Initializing zipcode database');
    var lastCharacter = 0;
    var numberOfLines = 0;

    function handleDataChunk(event) {
        var config = {
            database: database,
            store: 'locations',
            isWritable: true,
            storeCallback: function (store, transaction) {
                function storeZipcodes(lines) {
                    lines.toArray().forEach(function (line) {
                        statusLine.display('Putting: ' + line);
                        var fields = line.split(',');
                        store.put({
                            zipcode: fields[0],
                            city: fields[1],
                            state: fields[2],
                            latitude: fields[3],
                            longitude: fields[4]
                        });
                    });
                }

                var responseText = event.target.responseText;
                var lastNewLine = responseText.lastIndexOf('\n');
                if (lastNewLine > lastCharacter) {
                    var chunk = responseText.substring(lastCharacter, lastNewLine);
                    lastCharacter = lastNewLine + 1;

                    var lines = chunk.split('\n');
                    numberOfLines += lines.length;
                    storeZipcodes(lines);
                    statusLine.display('Initializing zipcode database: loaded ' + numberOfLines + ' records.');
                }

                if (event.type === 'load') {
                    var zip = document.getElementById('zipcode_input').value;
                    cities.lookup(zip, function () {
                        statusLine.remove();
                        alert('Data loaded.  Please refresh the page and try again');
                    });
                }
            }
        };
        MediusDB.withStore(config);
    }

    MediusHttp.get({
        errorHandler: status.display,
        progressHandler: handleDataChunk,
        loadHandler: handleDataChunk,
        url: 'data/zipcode.csv'
    });

    callback();
}

function withPostalCodeDatabase(onSuccess) {
    'use strict';
    MediusDB.withDatabase({
        database: {
            name: DATABASE.NAME,
            version: DATABASE.VERSION
        },
        events: {
            upgradeneeded: MediusDB.defaultDatabaseUpgrade({
                META_VERSION_CONTROL: {
                    keyDefinition: {keyPath: 'storeName', autoIncrement: true}
                },
                locations: {
                    keyDefinition: {keyPath: 'zipcode', autoIncrement: true},
                    indexes: [
                        {propertyName: 'city', indexName: 'cities', options: {unique: false}}
                    ]
                }
            }),
            upgradeSuccess: MediusDB.initializeDatabase({
                locations: {
                    latestVersion: LOCATIONS.VERSION,
                    initialize: insertZipcodes
                }
            }),
            success: function (event) {
                var database = event.target.result;
                onSuccess(database, event);
            }
        }
    });
}

function deleteDatabase() {
    'use strict';
    MediusDB.deleteDatabase(DATABASE.NAME);
}