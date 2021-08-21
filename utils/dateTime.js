const moment = require("moment");

const DATE_FORMAT = "DD-MM-YYYY";

const checkDate = (date) => {
    return date ? date : new Date();
}

module.exports.getStartTimeFromParameter = (days) => {
    var startTime = -1;

    switch (days) {
        case '1y':
            startTime = moment().subtract(1, 'years');
            break;
        case '6m':
            startTime = moment().subtract(6, "months");
            break;
        case '30d':
            startTime = moment().subtract(30, 'days');
            break;
        case '7d':
            startTime = moment().subtract(7, 'days');
            break;
        case '1d':
            startTime = moment().subtract(1, 'days');
            break;
    }

    return startTime;
}

module.exports.getCurrentTimestamp = () => {
    return new Date().getTime();
}

module.exports.toTimestamp = (date) => {
    return date ? date.unix() : null;
}

module.exports.formatDateForTimestamp = (timestamp) => {
    return moment.unix(timestamp).format(DATE_FORMAT);
}

module.exports.subtractDay = (subtractDays, date) => {
    let selectedDate = checkDate(date);
    return moment(selectedDate).subtract(subtractDays, "days");
}

module.exports.subtractMonth = (subtractMonths, date) => {
    let selectedDate = checkDate(date);
    return moment(selectedDate).subtract(subtractMonths, "months");
}

module.exports.subtractYear = (subtractYears, date) => {
    let selectedDate = checkDate(date);
    return moment(selectedDate).subtract(subtractYears, "years");
}