import { Page, ElementHandle } from 'puppeteer'
import { getCurrentYear, getCurrentMonth, getWorkDay } from './helpers'
import {
	CREATE_TASK_POPOVER_OPEN_LINK,
	CREATE_TASK_POPOVER_POPOVER,
	CREATE_TASK_POPOVER_SELECT_TYPE,
	CREATE_TASK_POPOVER_SUBMIT_BUTTON,
	SUMMARY_PAGE_SUMMARY_FIELD,
	SUMMARY_PAGE_SUBMIT_BUTTON,
	TASK_DETAILS_PAGE_TASK_ID_LINK,
	LOG_WORK_URL,
	LOG_WORK_LOG_BUTTON,
	LOG_WORK_SPENT_HOURS_INPUT,
	LOG_WORK_DATE_INPUT,
	LOG_WORK_COMMENT_INPUT,
	LOG_WORK_SUBMIT_BUTTON,
} from './selectors'

export interface TaskConfiguration {
	day: number
	month: string
	year: number
	date: string
	spentHours: number
	title: string
	description: string
	hours: string
	type: string // TODO: change to types value
	taskID: null | string
}

const TASK_CONFIGURATION: TaskConfiguration = {
	day: null,
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
	page: Page
	configuration: TaskConfiguration
	constructor(page: Page, task: TaskConfiguration | string, indexOfWorkingDay: number) {
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

	async createTask(): Promise<void> {
		const { page } = this
		await page.click(CREATE_TASK_POPOVER_OPEN_LINK)
		await page.waitForSelector(CREATE_TASK_POPOVER_POPOVER)
		await page.select(CREATE_TASK_POPOVER_SELECT_TYPE, this.configuration.type)
		await page.click(CREATE_TASK_POPOVER_SUBMIT_BUTTON)
		await page.waitForSelector(SUMMARY_PAGE_SUMMARY_FIELD)

		await page.type(SUMMARY_PAGE_SUMMARY_FIELD, this.configuration.title)
		await page.click(SUMMARY_PAGE_SUBMIT_BUTTON)

		await page.waitForSelector(TASK_DETAILS_PAGE_TASK_ID_LINK)
		const aWithTaskID: ElementHandle = await page.$(TASK_DETAILS_PAGE_TASK_ID_LINK)
		const taskID: string = await page.evaluate(element => element.textContent, aWithTaskID)
		this.configuration.taskID = taskID
	}

	async logTime(): Promise<void> {
		const { page, configuration } = this

		await page.goto(`${LOG_WORK_URL}${configuration.taskID}`, {
			waitUntil: 'networkidle2',
			timeout: 3000000,
		})
		await page.click(LOG_WORK_LOG_BUTTON)
		await page.waitForSelector(LOG_WORK_SPENT_HOURS_INPUT)
		await page.type(LOG_WORK_SPENT_HOURS_INPUT, this.configuration.spentHours + '')

		const dateInput: ElementHandle = await page.$(LOG_WORK_DATE_INPUT)
		await dateInput.click({ clickCount: 3 })

		await dateInput.type(this.configuration.date)
		await page.type(LOG_WORK_COMMENT_INPUT, this.configuration.description)
		await page.click(LOG_WORK_SUBMIT_BUTTON)

		await page.waitForSelector(CREATE_TASK_POPOVER_OPEN_LINK)
	}
}

async function createTasksAndLogTime(page: Page, tasks: TaskConfiguration[] | string[]): Promise<void> {
	for (let i = 0; i < tasks.length; i++) {
		const task: ConfigTask = new ConfigTask(page, tasks[i], i)
		await task.createTask()
		await task.logTime()
	}
}

export { createTasksAndLogTime }
