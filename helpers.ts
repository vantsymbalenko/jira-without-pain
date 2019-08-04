function getCurrentYear(): number {
	return new Date().getFullYear()
}

interface CurrentMonth{
	name: 'Jan' | 'Feb' | 'Mar' | 'Apr'| 'May'| 'Jun'| 'Jul'| 'Aug'| 'Sep'| 'Oct'| 'Nov'| 'Dec'
	index: number
}
function getCurrentMonth(): CurrentMonth {
	const monthNames: CurrentMonth['name'][] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	return {
		name: monthNames[new Date().getMonth()],
		index: new Date().getMonth(),
	}
}

function isWeekday(year: number, month: number, day: number): boolean {
	var dayInWeek = new Date(year, month - 1, day).getDay()
	return dayInWeek != 0 && dayInWeek != 6
}

function daysInMonth(month: number, year: number): number {
	return new Date(year, month, 0).getDate()
}

function getWorkDaysInMonth(year: number, month: number): number[] {
	var days = daysInMonth(year, month)
	var weekdays = []
	for (var i = 0; i < days; i++) {
		if (isWeekday(year, month, i + 1)) {
			weekdays.push(i + 1)
		}
	}
	return weekdays
}

function getWorkDay(year: number, month: number, dayIndex: number): number {
	return getWorkDaysInMonth(year, month)[dayIndex]
}

export { getCurrentMonth, getCurrentYear, getWorkDay, getWorkDaysInMonth }
