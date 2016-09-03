MediusStatus = {
    createStatus: function (message) {
        'use strict';
        var statusLine;

        function display(message) {
            statusLine.innerHTML = message.toString();
        }

        function remove() {
            document.body.removeChild(this);
        }

        statusLine = document.createElement('div');
        statusLine.className = 'statusLine';
        document.body.appendChild(statusLine);
        display(message);
        statusLine.display = display;
        statusLine.remove = remove;
        return statusLine;
    }
};