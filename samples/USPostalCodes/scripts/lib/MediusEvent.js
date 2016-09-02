/* global MediusLog */

var MediusEvent = {
    add: function (target, type, handler) {
        'use strict';
        if (typeof target === 'string') {
            target = document.querySelector(target);
        }

        if (target.addEventListener) {
            target.addEventListener(type, handler, false);
        } else {
            target.attachEvent('on' + type, function (event) {
                return handler.call(target, event);
            });
        }

        if (type !== 'error') {
            MediusEvent.add(target, 'error', MediusLog.error);
        }
    }
};
