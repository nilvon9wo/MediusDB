/* global DATABASE_NAME, IDBKeyRange, logHelper, DATABASE_STORE, MediusDB, LOCATIONS */

var Zipcodes = {
    display: function (city) {
        'use strict';
        var output = document.getElementById('zipcodes');
        output.innerHTML = 'Matching zipcodes';
        Zipcodes.lookup(city, function (result) {
            var div = document.createElement('div');
            var text = result.zipcode + ': ' + result.city + ', ' + result.state;
            div.appendChild(document.createTextNode(text));
            output.appendChild(div);
        });
    },
    lookup: function (city, callback) {
        'use strict';
        withPostalCodeDatabase(function (database) {
            MediusDB.withCursor({
                database: database,
                store: LOCATIONS.STORENAME,
                range: {only: city},
                index: 'cities',
                cursorCallback: function (cursor) {
                    callback(cursor.value);
                }
            });
        });
    }
};
