Object.prototype.method = function (name, func, override) {
    'use strict';
    if (override || !this.prototype[name]) {
        this.prototype[name] = func;
        Object.defineProperty(this.prototype, name, {enumerable: false});
        return this;
    }
};
Object.defineProperty(Object.prototype, 'method', {enumerable: false});

Object.toArray = function (array, startIndex) {
    'use strict';
    startIndex = startIndex || 0;
    return Array.prototype.slice.call(array, startIndex);
};

Object.method('toArray', function (startIndex){
    'use strict';
    return Object.toArray(this, startIndex);
});