const { getCurrentYear, getCurrentMonth, getWorkDay } = require('./helpers')

const TASK_CONFIGURATION = {
	day: '',
	month: getCurrentMonth().name,
	year: getCurrentYear(),
	date: '',
	spentHours: 8,
	title: '',
	description: '',
	hours: '09:00 AM',
	type: '3',
	taskID: null,
}

class ConfigTask {
	constructor(page, task, indexOfWorkingDay) {
		this.page = page
		this.configuration = Object.assign({}, TASK_CONFIGURATION)
		switch (typeof task) {
			case 'string': {
				this.configuration.title = task
				this.configuration.description = task
				this.configuration.day = getWorkDay(this.configuration.year, getCurrentMonth().index, indexOfWorkingDay)
				break
			}
			case 'object': {
				Object.assign(
					this.configuration,
					{ day: getWorkDay(this.configuration.year, getCurrentMonth().index, indexOfWorkingDay) },
					task,
				)
				break
			}
		}
		const { day, month, year, hours } = this.configuration
		this.configuration.date = `${day}/${month}/${year % 100} ${hours}`
	}

	async createTask() {
		const { page } = this
		await page.click('a#create_link')
		await page.waitForSelector('#quick-issuetype')
		await page.select('#quick-issuetype', this.configuration.type)
		await page.click('#quick-create-button')
		await page.waitForSelector('#summary')

		await page.type('#summary', this.configuration.title)
		await page.click('#create_submit')

		await page.waitForSelector('#key-val')
		const aWithTaskID = await page.$('#key-val')
		const taskID = await page.evaluate(element => element.textContent, aWithTaskID)
		this.configuration.taskID = taskID
	}

	async logTime() {
		const { page, configuration } = this

		await page.goto(`http://jira.n-cube.co.uk:8099/browse/${configuration.taskID}`, {
			waitUntil: 'networkidle2',
			timeout: 3000000,
		})
		await page.click("a[title='Log work']")
		await page.waitForSelector("input[name='timeLogged']")
		await page.type("input[name='timeLogged']", this.configuration.spentHours + '')

		const dateInput = await page.$('#date_startDate')
		await dateInput.click({ clickCount: 3 })

		await dateInput.type(this.configuration.date)
		await page.type('textarea[name="comment"]', this.configuration.description)
		await page.click('#log_submit')

		await page.waitForSelector('a#create_link')
	}
}

async function createTasksAndLogTime(page, tasks) {
	for (let i = 0; i < tasks.length; i++) {
		const task = new ConfigTask(page, tasks[i], i)
		await task.createTask()
		await task.logTime()
	}
}

module.exports = {
	createTasksAndLogTime,
}
