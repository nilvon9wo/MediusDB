/* global MediusEvent */

var MediusHttp = {
    get: function (config) {
        'use strict';
        var xhr = new XMLHttpRequest();
        MediusEvent.add(xhr, 'error', config.errorHandler);
        MediusEvent.add(xhr, 'progress', config.progressHandler);
        MediusEvent.add(xhr, 'load', config.loadHandler);
        xhr.open('GET', config.url);
        xhr.send();
    }
};