/* global isNaN, ComplexNumber */

(function () {
    Object.defineProperty(Object.prototype, 'objectId', {
        get: idGetter,
        enumerable: false,
        configurable: false
    });

    var idGetter = function () {
        var idProperty = '|**objectId**|';
        var nextId = 1;
        return function () {
            if (!(idProperty in this)) {
                if (!Object.isExtensible(this)) {
                    throw new Error('Can\'t define id for nonextensible objects');
                }
                Object.defineProperty(this, idProperty, {
                    value: nextId++,
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            }
            return this[idProperty];
        };
    };
}());

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
    classOf: function (obj) {
        'use strict';
        if (obj === null) {
            return 'null';
        }
        if (obj === undefined) {
            return 'undefined';
        }
        return Object.prototype.toString.call(obj).slice(8, -1);
    },
    create: function (obj) {
        'use strict';
        var Func = function () {
        };
        'use strict';
        Func.prototype = obj;
        return new Func();
    },
    freezeProperties: function (obj) {
        return this.modifyProperties(obj, {
            writable: false,
            configurable: false
        });
    },
    getPropertyNames: function (obj, targetArray) {
        'use strict';
        if (typeof obj !== 'object') {
            throw TypeError();
        }

        var result = (targetArray && targetArray.isArray()) || [];
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                result.push(property);
            }
        }
        return result;
    },
    getType: function (obj) {
        var _type;
        var _class;
        var _name;
        if (obj === null) {
            return 'null';
        }
        if (obj === undefined) {
            return 'undefined';
        }
        if (obj !== obj) {
            return 'NaN';
        }
        if ((_type = typeof obj) !== 'object') {
            return _type;
        }
        if ((_class = Object.classOf(obj)) !== 'Object') {
            return _class;
        }
        if (obj.constructor &&
                typeof obj.constructor === 'function' &&
                (_name = obj.constructor.getName())
                ) {
            return _name;
        }
        return 'Object';
    },
    getTypeAndValue: function (x) {
        return Object.getType(x) + ': ' + x;
    },
    hideProperties: function (obj) {
        return this.modifyProperties(obj, {
            enumerable: false
        });
    },
    inherit: function (param) {
        'use strict';
        if (param === null) {
            throw TypeError();
        }
        if (Object.create) {
            return Object.create(param);
        }

        var type = typeof param;
        if (type !== 'object' && type !== 'function') {
            throw TypeError();
        }

        function f() {
        }
        f.prototype = param;
        return new f();
    },
    intersection: function (o, p) {
        'use strict';
        return Object.restrict(
                Object.extend({}, o),
                p
                );
    },
    isArray: function (value) {
        return (typeof value === 'object') &&
                (Object.classOf && Object.classOf(value) === 'Array') ||
                (!!value &&
                        typeof value.length === 'number' &&
                        typeof value.splice === 'function' &&
                        !(value.propertyIsEnumerable('length'))
                        );
    },
    isArrayLike: function (obj) {
        'use strict';
        return (obj &&
                typeof obj === 'object' &&
                isFinite(obj.length) &&
                obj.length >= 0 &&
                obj.length === Math.floor(obj.length) &&
                obj.length < 4294967296
                );
    },
    isFunction: function (value) {
        'use strict';
        return Object.prototype.toString.call(value) === '[object Function';
    },
    isNumber: function (x) {
        return !(isNaN(x));
    },
    merge: function (o, p) {
        'use strict';
        for (var property in p) {
            if (o.hasOwnProperty([property])) {
                continue;
            }

            o[property] = p[property];
        }
        return o;
    },
    modifyProperties: function (obj, newPropertyValue) {
        var properties = (arguments.length === 1) ?
                Object.getOwnPropertyNames(obj) :
                Array.prototype.splice.call(arguments, 1);
        properties.forEach(function (property) {
            if (!Object.getOwnPropertyDescriptor ||
                    !Object.getOwnPropertyDescriptor(obj, property) ||
                    !Object.getOwnPropertyDescriptor(obj, property).configurable) {
                return;
            }
            Object.defineProperty(obj, property, newPropertyValue);
        });
        return obj;
    },
    quacks: function (obj) {
        for (var index = 1; index < arguments.length; index++) {
            var requiredMethod = arguments[index];
            switch (typeof requiredMethod) {
                case 'string' :
                    if (obj[requiredMethod] !== 'function') {
                        return false;
                    }
                    continue;
                case 'function' :
                    requiredMethod = requiredMethod.prototype;
                case 'object' :
                for (var method in requiredMethod) {
                    if (typeof requiredMethod[method] !== 'function') {
                        continue;
                    }
                    if (typeof obj[method] !== 'function') {
                        return false;
                    }
                }
            }
        }
        return true;
    },
    restrict: function (o, p) {
        'use strict';
        for (var property in o) {
            if (!(property in p)) {
                delete o[property];
            }
        }
        return o;
    },
    subtract: function (o, p) {
        'use strict';
        for (var property in p) {
            delete o[property];
        }
        return o;
    },
    toArray: function (array, startIndex) {
        startIndex = startIndex || 0;
        return Array.prototype.slice.call(array, startIndex);
    },
    union: function (o, p) {
        'use strict';
        return Object.extend(
                Object.extend({}, o),
                p
                );
    }
}, true);


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
    addPrivateProperty: function (name, predicate) {
        var currentValue;
        this['get' + name] = function () {
            return currentValue;
        };

        this['set' + name] = function (newValue) {
            if (predicate && !predicate(newValue)) {
                throw new Error("set" + name + ": invalid value " + newValue);
            } else {
                currentValue = newValue;
            }
        };
    },
    forEachOwnProperty: function (callback) {
        'use strict';
        for (var property in this) {
            if (this.hasOwnProperty[property]) {
                callback(property);
            }
        }
    },
    getClass: function () {
        'use strict';
        return Object.classOf(this);
    },
    getPropertyNames: function () {
        'use strict';
        return Object.getPropertyNames(this);
    },
    inherits: function (Parent) {
        'use strict';
        this.prototype = new Parent();
        return this;
    },
    isArray: function () {
        'use strict';
        return Object.isArray(this);
    },
    isArrayLike: function () {
        'use strict';
        return Object.isArrayLike(this);
    },
    isFunction: function () {
        'use strict';
        return Object.isFunction(this);
    },
    logProperty: function (property) {
        'use strict';
        console.log(property + ': ' + this[property] + '\n');
    },
    logProperties: function (includeAll) {
        'use strict';
        var method = includeAll ? 'forEach' : 'forEachOwnProperty';
        this[method](this.printProperty);
    },
    superior: function (name) {
        'use strict';
        var that = this;
        var method = that[name];
        return function () {
            return method.apply(that, arguments);
        };
    },
    toArray: function (startIndex) {
        'use strict';
        return Object.toArray(this, startIndex);
    }
});