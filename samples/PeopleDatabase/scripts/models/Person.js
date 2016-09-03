/* global MediusDB, MediusElement */

function Person(config) {
    this.key = config.key;
    this.name = config.name;
    this.email = config.email;
    this.created = new Date();
}

Person.prototype.addToDatabase = function (config) {
    config.record = this;
    MediusDB.addRecord(config);
};

Person.fromForm = function () {
    return new Person({
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value
    });
};

Person.fromDatabaseByKey = function (config) {
    if (!config || !config.key || isNaN(config.key)) {
        throw new Error('fromDatabaseById requires Number key.');
    }
    config.key = Number(config.key);
    config.findMethod = 'Key';
    Person.fromDatabaseByProperty(config);
};

Person.fromDatabaseByName = function (config) {
    if (!config || !config.name) {
        throw new Error('fromDatabaseByEmail requires a name.');
    }
    config.indexName = 'name';
    config.indexValue = config.name;
    config.findMethod = 'Index';
    Person.fromDatabaseByProperty(config);
};

Person.fromDatabaseByEmail = function (config) {
    if (!config || !config.email) {
        throw new Error('fromDatabaseByEmail requires an email address.');
    }
    config.indexName = 'email';
    config.indexValue = config.email;
    config.findMethod = 'Index';
    Person.fromDatabaseByProperty(config);
};

Person.fromDatabaseByProperty = function (config) {
    var dbConfig = config;
    var personCallback = config.callback;
    dbConfig.callback = function (event) {
        personCallback(Person.fromDatabaseEvent(event, config.key));
    };

    MediusDB['readRecordBy' + config.findMethod](dbConfig);
};

Person.fromDatabaseEvent = function (event, key) {
    var result = event.target.result;
    var personConfig = {};
    for (var field in result) {
        personConfig[field] = result[field];
    }
    personConfig.key = key;
    return new Person(personConfig);
};

Person.displayDetails = function (container, person) {
    var createElement = MediusElement.create;
    container.innerHTML = createElement({
        tag: 'div',
        innerContent: function () {
            if (!person || !person.email) {
                return createElement({tag: 'h2', innerContent: 'No Match'});
            }

            var header = person.key ?
                    createElement({tag: 'h2', innerContent: 'Key ' + person.key}) :
                    '';

            var descriptionlist = createElement({
                tag: 'dl',
                innerContent: function () {
                    var children = '';
                    for (var field in person) {
                        if ((field !== 'key') && (typeof person[field] !== 'function')) {
                            children += createElement({tag: 'dt', innerContent: field});
                            children += createElement({tag: 'dd', innerContent: person[field]});
                        }
                    }
                    return children;
                }
            });

            return header + descriptionlist;
        }
    });
};