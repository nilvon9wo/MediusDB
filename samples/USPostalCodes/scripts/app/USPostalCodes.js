/* global statusHelper, logHelper, IndexedDB, cities, Event */

var DATABASE = {NAME: 'postalCodes', VERSION: 64};
var LOCATIONS = {STORENAME: 'locations', VERSION: 5};

function withPostalCodeDatabase(onSuccess) {
    'use strict';
    IndexedDB.withDatabase({
        database: {
            name: DATABASE.NAME,
            version: DATABASE.VERSION
        },
        events: {
            upgradeneeded: IndexedDB.defaultDatabaseUpgrade({
                META_VERSION_CONTROL: {
                    keyDefinition: {keyPath: 'storeName', autoIncrement: true}
                },
                locations: {
                    keyDefinition: {keyPath: 'zipcode', autoIncrement: true},
                    indexes: [
                        {propertyName: 'city', indexName: 'cities', options: {unique: false}}
                    ],
                    forceRecreate: true
                }
            }),
            upgradeSuccess: IndexedDB.initializeDatabase({
                locations: {
                    latestVersion: LOCATIONS.VERSION,
                    initialize: insertZipcodes
                }
            }),
            success: function(event) {
                var database = event.target.result;
                onSuccess(database, event);
            },
        }
    });
}

function insertZipcodes(zipcodeStore) {
    'use strict';
    var statusLine = statusHelper.createStatus('Initializing zipcode database');

    var xhr = new XMLHttpRequest();
    Event.add(xhr, 'error', status.display);
    Event.add(xhr, 'progress', handleDataChunk);
    Event.add(xhr, 'load', handleDataChunk);
    xhr.open('GET', 'data/zipcode.csv');
    xhr.send();

    var lastCharacter = 0;
    var numberOfLines = 0;

    function handleDataChunk(event) {
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
            cities.lookup('02134', function() {
                document.body.removeChild(statusLine);
            });
        }

        function storeZipcodes(lines) {
            lines.toArray().forEach(function(line) {
                var fields = line.split(',');
                zipcodeStore.put({
                    zipcode: fields[0],
                    city: fields[1],
                    state: fields[2],
                    latitude: fields[3],
                    longitude: fields[4]
                });
            });
        }
    }
}

function deleteDatabase() {
    'use strict';
    IndexedDB.deleteDatabase(DATABASE.NAME);
}