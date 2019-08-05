import puppeteer, { Browser, Page } from 'puppeteer'
import { signIn } from './signIn'
import { createTasksAndLogTime, TaskConfiguration, Options } from './createTaksAndLogTime'
import { consoleEror } from './helpers';

interface BrowserAndPage {
	browser: Browser
	page: Page
}

async function createBrowser(): Promise<BrowserAndPage> {
	const browser = await puppeteer.launch({
		headless: false,
		slowMo: 50,
	})
	const page = await browser.newPage()

	await page.setRequestInterception(true)
	page.on('request', request => {
		if (
			request.url().endsWith('combine.css') ||
			request.url().endsWith('.png') ||
			request.url().endsWith('.gif') ||
			request.url().endsWith('.jpg') ||
			request.url().endsWith('.jpeg')
		) {
			request.abort()
		} else {
			request.continue()
		}
	})
	return { browser, page }
}

interface InteractionParameters {
	jiraLogin: string
	jiraPassword: string
	tasks: TaskConfiguration[] | string[]
	options?: Options
}

async function runInteraction({
	jiraLogin: JIRA_LOGIN,
	jiraPassword: JIRA_PASSWORD,
	tasks,
	options
}: InteractionParameters): Promise<void> {
	if(options.randomFill && options.randomlyCompleteFill){
		consoleEror("Both randomFill and randomlyCompleteFill was specified. Please choose only one options.")
	}
	const { page, browser } = await createBrowser()
	await signIn(page, JIRA_LOGIN, JIRA_PASSWORD)
	await createTasksAndLogTime(page, tasks, options)

	await browser.close()
}

export { runInteraction }
