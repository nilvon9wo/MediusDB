/* global MediusLog */

var MediusEvent = (function () {
    function add(target, type, handler) {
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
            add(target, 'error', MediusLog.error);
        }
    }

    function addClick(target, handler) {
        add(target, 'click', handler);
    }

    var whenReady = (function () {
        var funcs = [];
        var ready = false;

        add(document, 'DOMContentLoaded', handler);
        add(document, 'readystatechange', handler);
        add(window, 'load', handler);

        return function (func) {
            if (ready) {
                func.call(document);
            } else {
                funcs.push(func);
            }
        };

        function handler(event) {
            if (ready || isDocumentComplete(event)) {
                return;
            }

            for (var index = 0; index < funcs.length; index++) {
                funcs[index].call(document);
            }

            ready = true;
            funcs = null;
        }

        function isDocumentComplete(event) {
            return event.type === 'readystatechange' &&
                    document.readyState !== 'complete';
        }
    }());

    return {
        add: add,
        addClick: addClick,
        whenReady: whenReady
    };
}());