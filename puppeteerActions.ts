import { Page, ElementHandle } from 'puppeteer'

import { TaskConfiguration } from './createTaksAndLogTime'

import {
	LOG_WORK_URL,
	LOG_WORK_LOG_BUTTON,
	LOG_WORK_SPENT_HOURS_INPUT,
	LOG_WORK_DATE_INPUT,
	LOG_WORK_COMMENT_INPUT,
	LOG_WORK_SUBMIT_BUTTON,
	CREATE_TASK_POPOVER_OPEN_LINK,
	CREATE_TASK_POPOVER_POPOVER,
	CREATE_TASK_POPOVER_SELECT_TYPE,
	CREATE_TASK_POPOVER_SUBMIT_BUTTON,
	SUMMARY_PAGE_SUMMARY_FIELD,
	SUMMARY_PAGE_SUBMIT_BUTTON,
	TASK_DETAILS_PAGE_TASK_ID_LINK,
	LOGIN_LINK_JIRA,
	MAIN_PAGE_CREATE_TASK,
} from './selectors'

async function logWork(page: Page, task: TaskConfiguration, options?: any) {
	await page.goto(`${LOG_WORK_URL}${task.taskID}`, {
		waitUntil: 'networkidle2',
		timeout: 3000000,
	})
	await page.click(LOG_WORK_LOG_BUTTON)
	await page.waitForSelector(LOG_WORK_SPENT_HOURS_INPUT)
	await page.type(LOG_WORK_SPENT_HOURS_INPUT, task.spentHours.toString())

	const dateInput: ElementHandle = await page.$(LOG_WORK_DATE_INPUT)
	await dateInput.click({ clickCount: 3 })

	await dateInput.type(task.date)
	await page.type(LOG_WORK_COMMENT_INPUT, task.description)
	await page.click(LOG_WORK_SUBMIT_BUTTON)

	await page.waitForSelector(CREATE_TASK_POPOVER_OPEN_LINK)
}

async function createTask(page: Page, task: TaskConfiguration): Promise<string> {
	await page.click(CREATE_TASK_POPOVER_OPEN_LINK)
	await page.waitForSelector(CREATE_TASK_POPOVER_POPOVER)
	await page.select(CREATE_TASK_POPOVER_SELECT_TYPE, task.type)
	await page.click(CREATE_TASK_POPOVER_SUBMIT_BUTTON)
	await page.waitForSelector(SUMMARY_PAGE_SUMMARY_FIELD)
	await page.type(SUMMARY_PAGE_SUMMARY_FIELD, task.title)
	await page.click(SUMMARY_PAGE_SUBMIT_BUTTON)

	await page.waitForSelector(TASK_DETAILS_PAGE_TASK_ID_LINK)
	const aWithTaskID: ElementHandle = await page.$(TASK_DETAILS_PAGE_TASK_ID_LINK)
	const taskID: string = await page.evaluate(element => element.textContent, aWithTaskID)
	return taskID
}

async function createTasks(page: Page, tasks: TaskConfiguration[]): Promise<TaskConfiguration[]> {
	const tasksWithTaskId = Array.from(tasks)
	for (let i = 0; i < tasks.length; ++i) {
		const taskId = await createTask(page, tasks[i])

		if (process.env.LOCAL) {
			await page.goto(MAIN_PAGE_CREATE_TASK)
		}
		await page.waitForSelector(CREATE_TASK_POPOVER_OPEN_LINK)

		tasksWithTaskId[i].taskID = taskId
	}
	return tasksWithTaskId
}

async function logTasks(page: Page, tasks: TaskConfiguration[]): Promise<void> {
	for (let i = 0; i < tasks.length; ++i) {
		await logWork(page, tasks[i])
	}
}

export { createTask, createTasks, logWork, logTasks }
