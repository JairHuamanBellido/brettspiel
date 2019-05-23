const closeYearBy4Module = (numb) => {
    let founded;
    for (let i = numb; i >= 0; i--) {
        if (i % 4 === 0) {
            founded = i;
            break;
        }
    }
    return founded;
}

const daysUntilYear = (year) => {
    return closeYearBy4Module(year) / 4 * 1461;
}

const calculateDaysUntilYear = (year) => {
    return (year % 4 == 0) ? daysUntilYear(year) :
        daysUntilYear(year) + 366 + (365 * (year - (closeYearBy4Module(year) + 1)));
}

const calculateOddMonths = (NumberMonth) => {
    let count = 0;
    for (let i = 1; i <= NumberMonth; ++i) {
        if (i % 2 != 0) {
            count++;
        }
    }
    return count;
}

const calculateEvenMonths = (NumberMonth) => {
    let count = 0;
    for (let i = 1; i <= NumberMonth; ++i) {
        if (i % 2 === 0 && i != 2) {
            count++;
        }
    }
    return count;
}


const DaysisBisiestAño = (year) => {
    return (year % 4 == 0) ? 29 : 28;
}

const calculateDaysUntilMonth = (month, year) => {
    return (31 * calculateOddMonths(month)) + (DaysisBisiestAño(year)) + (30 * calculateEvenMonths(month));
}



const dayNumber = (date) => {
    let day = parseInt(date.slice(8,10));
    let mounth = parseInt(date.slice(5, 7)) - 1;
    let year = parseInt(date.slice(0, 4));
    return (mounth == 0) ? calculateDaysUntilYear(year) + day :
        calculateDaysUntilYear(year) + calculateDaysUntilMonth(mounth) + day;

}