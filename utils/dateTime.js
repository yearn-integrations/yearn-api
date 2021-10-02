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
        case '90d':
            startTime = moment().subtract(90, "days");
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

module.exports.toMillisecondsTimestamp = (date) => {
    try {
        let selectedDate = checkDate(date);
        return moment(selectedDate).valueOf();
    } catch(err) {
        console.error(`[dateTimeHelper] toMilliTimestamp(): `,err);
    }
}

module.exports.formatDateForTimestamp = (timestamp) => {
    return moment.unix(timestamp).format(DATE_FORMAT);
}

module.exports.formatDate = (date, format = null) => {
    try {
        const dateFormat = format ? format : DATE_FORMAT;
        return moment(date).format(dateFormat);
    } catch (err) {
       console.log(`[dateTimeHelper] formatDate(): `,err);
    }
}

module.exports.addDay = (addDays, date) => {
    let selectedDate = checkDate(date);
    return moment(selectedDate).subtract(addDays, "days");
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

module.exports.getStartOfDay = (momentDate) => {
    try {
        if(!momentDate || momentDate === undefined) {
            throw(`Missing Date Object`);
        }
        return momentDate.startOf("day");
    } catch(err) {
        console.err(`[dateTimeHelper] getStartOfDay(): `, err);
    }
}

module.exports.isSame = (date1, date2, compareUnit) => {
    try {
        if(!date1 || !date2 || date1 === undefined || date2 === undefined) {
            throw(`Missing date1 / date2 for comparison`);
        }

        const supportedUnit = ["year","month","week", "day", "hour", "minute", "second"];
        if(compareUnit === "" || compareUnit === undefined || !supportedUnit.includes(compareUnit)) {
            throw(`Invalid compare unit. Please use "year","month","week", "day", "hour", "minute", "second" `);
        }
        return moment(date1).isSame(moment(date2), compareUnit);
    } catch (err) {
        console.error(`Error in isSame(): `, err);
    }
}