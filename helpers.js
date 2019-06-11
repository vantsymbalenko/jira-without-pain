function getCurrentYear() {
	return new Date().getFullYear()
}

function getCurrentMonth() {
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	return {
		name: monthNames[new Date().getMonth()],
		index: new Date().getMonth(),
	}
}

function isWeekday(year, month, day) {
	var day = new Date(year, month, day).getDay()
	return day != 0 && day != 6
}

function daysInMonth(month, year) {
	return new Date(year, month - 1, 0).getDate()
}

function getWorkDaysInMonth(year, month) {
	var days = daysInMonth(year, month)
	var weekdays = []
	for (var i = 0; i < days; i++) {
		if (isWeekday(year, month, i + 1)) {
			weekdays.push(i + 1)
		}
	}
	return weekdays
}

function getWorkDay(year, month, dayIndex) {
	return getWorkDaysInMonth(year, month)[dayIndex]
}

module.exports = {
	getCurrentMonth,
	getCurrentYear,
	getWorkDay,
}
