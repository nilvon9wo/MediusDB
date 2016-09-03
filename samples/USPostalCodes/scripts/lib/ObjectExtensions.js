Object.toArray = function (array, startIndex) {
    'use strict';
    startIndex = startIndex || 0;
    return Array.prototype.slice.call(array, startIndex);
};

Object.prototype.toArray = function (startIndex) {
    'use strict';
    return Object.toArray(this, startIndex);
};