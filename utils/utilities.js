module.exports.getDates = () => {
    const todaysEpoch = Date.now();
    const date = new Date(todaysEpoch)

    const hour = date.getHours()
    const min = date.getMinutes()
    const TodaySecLeft = (86400 - (hour * 3600 + min * 60)) * 1000
    const afterTDsec = (TodaySecLeft + (29 * 86400 * 1000))
    const maxDateEpoch = (todaysEpoch + afterTDsec)
    const maxDate = new Date(maxDateEpoch)


    return {
        maxDate:maxDate.toISOString().slice(0,10),
        minDate:date.toISOString().slice(0,10),
    }
}