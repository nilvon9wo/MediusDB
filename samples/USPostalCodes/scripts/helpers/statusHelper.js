statusHelper = {
    createStatus: function (message) {
        'use strict';
        var statusLine = document.createElement('div');
        statusLine.className = 'statusLine';
        document.body.appendChild(statusLine);
        display(message);
        statusLine.display = display;
        return statusLine;

        function display(message) {
            statusLine.innerHTML = message.toString();
        }
    }
};