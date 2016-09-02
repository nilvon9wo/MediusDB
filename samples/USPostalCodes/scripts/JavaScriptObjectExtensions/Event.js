/* global Log */

var Event = Event || {};
Event.add = Event.add || function (target, type, handler) {
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
        Event.add(target, 'error', Log.error);
    }
};

Event.addClick = Event.addClick || function (element, onClick) {
    this.add(element, 'click', onClick);
};