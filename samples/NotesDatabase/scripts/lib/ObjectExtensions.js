Object.defineProperty(Object.prototype, 'extend', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: (function () {
        'use strict';
        var extend = function (obj, override) {
            var targetThis = this;
            var names = Object.getOwnPropertyNames(obj);
            names.forEach(function (name) {
                if (override || !(name in targetThis)) {
                    var desc = Object.getOwnPropertyDescriptor(obj, name);
                    Object.defineProperty(targetThis, name, desc);
                }
            });
        };

        var ieExtend = function (obj) {
            var PROTOTYPE_PROPERTIES = [
                "toString", "valueOf", "constructor", "hasOwnProperty",
                "isPrototypeOf", "propertyIsEnumerable", "toLocaleString"
            ];
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                for (var property in source) {
                    obj[property] = source[property];
                }
                for (var j = 0; j < PROTOTYPE_PROPERTIES.length; j++) {
                    var protoProperty = PROTOTYPE_PROPERTIES[j];
                    if (source.hasOwnProperty(protoProperty)) {
                        obj[protoProperty] = source[protoProperty];
                    }
                }
            }
        };

        for (var property in {toString: null}) {
            return extend;
        }

        return ieExtend;
    }())
});

Object.extend({
    isArray: function (value) {
        return (typeof value === 'object') &&
                (Object.classOf && Object.classOf(value) === 'Array') ||
                (!!value &&
                        typeof value.length === 'number' &&
                        typeof value.splice === 'function' &&
                        !(value.propertyIsEnumerable('length'))
                        );
    },
    toArray: function (array, startIndex) {
        'use strict';
        startIndex = startIndex || 0;
        return Array.prototype.slice.call(array, startIndex);
    }
});

// -------------------------------------------------

Object.prototype.method = function (name, func, override) {
    'use strict';
    if (override || !this.prototype[name]) {
        this.prototype[name] = func;
        Object.defineProperty(this.prototype, name, {enumerable: false});
        return this;
    }
};
Object.defineProperty(Object.prototype, 'method', {enumerable: false});

Object.method('extendPrototype', function (extension) {
    for (var property in extension) {
        if (extension.hasOwnProperty(property)) {
            this.method(property, extension[property], true);
        }
    }
});

Object.extendPrototype({
    isArray: function () {
        'use strict';
        return Object.isArray(this);
    },
    toArray: function (startIndex) {
        'use strict';
        return Object.toArray(this, startIndex);
    }
});


