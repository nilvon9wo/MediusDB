/* global Status, cities, MediusEvent, MediusDB, MediusHttp */

var DATABASE = {NAME: 'postalCodes', VERSION: 1};
var LOCATIONS = {STORENAME: 'locations', VERSION: 1};

function insertZipcodes(database) {
    'use strict';
    var statusLine = Status.createStatus('Initializing zipcode database');
    var lastCharacter = 0;
    var numberOfLines = 0;

    MediusHttp.get({
        errorHandler: status.display,
        progressHandler: handleDataChunk,
        loadHandler: handleDataChunk,
        url: 'data/zipcode.csv'
    });

    function handleDataChunk(event) {
        var responseText = event.target.responseText;
        var lastNewLine = responseText.lastIndexOf('\n');

        if (lastNewLine > lastCharacter) {
            var chunk = responseText.substring(lastCharacter, lastNewLine);
            lastCharacter = lastNewLine + 1;
            var lines = chunk.split('\n');
            storeLines(lines);
            numberOfLines += lines.length;
            statusLine.display('Initializing zipcode database: loaded ' + numberOfLines + ' records.');
        }

        if (event.type === 'load') {
            location.reload();
        }
    }

    function storeLines(lines) {
        MediusDB.withStore({
            database: database,
            store: LOCATIONS.STORENAME,
            isWritable: true,
            storeCallback: function (store, transaction) {
                lines.toArray().forEach(function (line) {
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
        });
    }
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