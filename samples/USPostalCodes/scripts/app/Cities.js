/* global DATABASE_NAME, logHelper, DATABASE_STORE, IndexedDB, DATABASE_VERSION, MediusDB, LOCATIONS */

var Cities = {
    display: function (zipcode) {
        'use strict';
        Cities.lookup(zipcode, function (cityName) {
            document.getElementById('city').value = cityName;
        });
    },
    lookup: function (zipcode, callback) {
        'use strict';
        withPostalCodeDatabase(function (database) {
            MediusDB.readRecordByKey({
                database: database,
                store: LOCATIONS.STORENAME,
                key: zipcode,
                events: {
                    success: function (event) {
                        var resultCity = event.target.result;
                        if (resultCity) {
                            callback(resultCity.city + ', ' + resultCity.state);
                        } else {
                            callback('Unknown zip code');
                        }
                    }
                }
            });
        });
    }
};