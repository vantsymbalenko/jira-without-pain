import { Page, ElementHandle } from 'puppeteer'
import {
	getCurrentYear,
	getCurrentMonth,
	getWorkDay,
	getWorkDaysInMonth,
	consoleWarning,
	Month,
	CurrentMonth,
	getRandomInt,
} from './helpers'
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
import { createTask, logWork, createTasks, logTasks } from './puppeteerActions'

export interface Options {
	randomlyCompleteFill: boolean // randomly complete filling report by existing tasks
	randomFill: boolean // randomly fill report
	month: CurrentMonth // name of month
	year: number // year
	spentHours: number // hours which spent for task
	logTime: string // hours when log task
}
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

const SPENT_HOURS: number = 8

const TASK_CONFIGURATION: TaskConfiguration = {
	day: null,
	month: getCurrentMonth().name,
	year: getCurrentYear(),
	date: '',
	spentHours: SPENT_HOURS,
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
		if (this.configuration.spentHours < SPENT_HOURS) {
			consoleWarning(
				`Time for ${this.configuration.date} was set manually. You should control spend hours by yourself for this day.`,
			)
		}
	}

	async createTask(): Promise<void> {
		if (this.configuration.taskID) {
			return
		}
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

function generateConfigurationsForTasks(
	tasks: any[],
	workDaysInMonth: number[],
	{ month, year, logTime, spentHours }: Partial<Options>,
): TaskConfiguration[] {
	const tasksObj = tasks.map((task, index) => {
		const configuration: TaskConfiguration = Object.assign({}, TASK_CONFIGURATION)

		configuration.spentHours = spentHours
		configuration.day = workDaysInMonth[index]
		configuration.year = year
		configuration.month = month.name
		configuration.date = `${workDaysInMonth[index]}/${month.name}/${year % 100} ${logTime}`

		switch (typeof task) {
			case 'string': {
				configuration.title = task
				configuration.description = task
				break
			}
			case 'object': {
				Object.assign(configuration, task)
				break
			}
		}
		if (configuration.spentHours < SPENT_HOURS) {
			consoleWarning(
				`Time for ${this.configuration.date} was set manually. You should control spend hours by yourself for this day.`,
			)
		}
		return configuration
	})
	return tasksObj
}

function createRandomTasks(
	basedTasks: TaskConfiguration[],
	length: number,
	workDays: number[],
	options: Partial<Options>,
): TaskConfiguration[] {
	const { month, year, logTime } = options
	const randomTasks = []
	for (let a = 0; a < length; ++a) {
		const randomInt = getRandomInt(0, createTasks.length - 1)
		const randomTask = Object.assign({}, basedTasks[randomInt])
		randomTask.day = workDays[a]
		randomTask.month = month.name
		randomTask.year = year
		randomTask.date = `${workDays[a]}/${month.name}/${year % 100} ${logTime}`
		randomTasks.push(randomTask)
	}
	return randomTasks
}

const DEFAULT_OPTIONS: Options = {
	randomFill: false,
	randomlyCompleteFill: false,
	month: getCurrentMonth(),
	year: getCurrentYear(),
	spentHours: 8,
	logTime: '09:00 AM',
}

const optionsGetter = {
	get: function(target, name) {
		return target.hasOwnProperty(name) ? target[name] : DEFAULT_OPTIONS[name]
	},
}

async function createTasksAndLogTime(
	page: Page,
	tasks: TaskConfiguration[] | string[],
	options: Partial<Options>,
): Promise<void> {
	const proxyOptions = new Proxy(options, optionsGetter)
	const { year, month, logTime, spentHours, randomFill, randomlyCompleteFill } = proxyOptions

	const workDaysInMonth = getWorkDaysInMonth(year, month.index + 1)
	const generatedTasks = generateConfigurationsForTasks(tasks, workDaysInMonth, { month, year, logTime, spentHours })
	let createdTasks = await createTasks(page, generatedTasks)

	// randomly fill report using generated tasks
	if (randomFill) {
		const randomTasks = createRandomTasks(createdTasks, workDaysInMonth.length, workDaysInMonth, proxyOptions)
		createdTasks = Array.from(randomTasks)
	}
	// randomly complete fill report using generated tasks
	if (randomlyCompleteFill) {
		const dayToAppend = workDaysInMonth.filter(day => createdTasks.every(task => task.day !== day))
		const randomTasks = createRandomTasks(createdTasks, dayToAppend.length, dayToAppend, proxyOptions)
		createdTasks.push(...randomTasks)
	}

	await logTasks(page, createdTasks)
}

export { createTasksAndLogTime }
