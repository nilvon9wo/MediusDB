/* global MediusDB, Page, MediusEvent, Person, DOMElement, MediusEvent */
// See http://code.tutsplus.com/tutorials/working-with-indexeddb--net-34673

var DATABASE = {NAME: 'people', VERSION: 1};

function withPeopleDatabase(onSuccess) {
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
                people: {
                    keyDefinition: {autoIncrement: true},
                    indexes: [
                        {propertyName: 'name', options: {unique: false}},
                        {propertyName: 'email', options: {unique: true}}
                    ]
                }
            }),
            success: function (event) {
                //var database = event.target.result;
                onSuccess(event);
            }
        }
    });
}

MediusEvent.whenReady(function () {
    if (!MediusDB.isSupported) {
        throw new Error('No, this browser can not support IndexDB.');
    }

    withPeopleDatabase(addEventsToButtons);
    
    function addEventsToButtons(event) {
        MediusEvent.addClick('#addPerson', function () {
            addPersonFromForm(event);
        });

        ['Key', 'Email'].forEach(function (property) {
            MediusEvent.addClick('#getPersonBy' + property, function () {
                displayDetails(event, property);
            });
        });

        MediusEvent.addClick('#getPeopleByNameRange', function () {
            displayPeople(event);
        });

        MediusEvent.addClick('#getPeople', function () {
            displayPeople(event, true);
        });
    }

    function addPersonFromForm(event) {
        Person.fromForm()
                .addToDatabase({
                    database: event.target.result,
                    store: 'people'
                });
    }

    function displayDetails(event, property) {
        console.log('event', event);
        var config = {
            database: event.target.result,
            store: 'people',
            callback: function (person) {
                var results = document.querySelector('#results');
                Person.displayDetails(results, person);
            }
        };
        config[property.toLowerCase()] = document.querySelector('#queryField').value;
        Person['fromDatabaseBy' + property](config);
    }

    function displayPeople(event, displayAll) {
        var personList = document.createElement('ol');

        var results = document.querySelector('#results');
        results.innerHTML = '';
        results.appendChild(personList);

        var config = {
            database: event.target.result,
            store: 'people',
            cursorCallback: function (cursor) {
                var item = document.createElement('li');
                var person = cursor.value;
                Person.displayDetails(item, new Person({
                    key: cursor.key,
                    name: person['name'],
                    email: person['email'],
                    created: person['created']
                }));
                personList.append(item);
            }
        };

        if (!displayAll) {
            config.index = 'name';
            config.range = {
                lowerBound: document.querySelector('#nameSearchStart').value,
                upperBound: document.querySelector('#nameSearchEnd').value
            };
        }

        MediusDB.withCursor(config);
    }
});

