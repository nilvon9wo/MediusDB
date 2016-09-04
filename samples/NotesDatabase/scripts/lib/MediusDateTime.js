var MediusDateTime = function () {
    function format(input) {
        if (!input) {
            return '';
        }

        return format.date(input) + ' ' + format.time(input);
    }

    format.date = function (input) {
        return input.getFullYear() + '/' +
                (input.getMonth() + 1) + '/' +
                input.getDate();
    };

    format.time = function time(input) {
        var hour = input.getHours();
        var timeSuffix = 'AM';

        if (hour === 12) {
            timeSuffix = 'PM';
        }

        if (hour > 12) {
            hour -= 12;
            timeSuffix = 'PM';
        }

        var minute = input.getMinutes() + 1;
        if (minute < 10) {
            minute = '0' + minute;
        }

        return hour + ':' + minute + ' ' + timeSuffix;
    };

    return {
        format: format
    };
}();



