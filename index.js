const puppeteer = require('puppeteer')
const { signIn } = require('./signin')
const { createTasksAndLogTime } = require("./createTaksAndLogTime")

async function createBrowser() {
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

async function runInteraction({jiraLogin: JIRA_LOGIN, jiraPassword: JIRA_PASSWORD, tasks }) {

	const { page, browser } = await createBrowser()
	await signIn(page, JIRA_LOGIN, JIRA_PASSWORD)
	await createTasksAndLogTime(page, tasks)

	await browser.close()
}

module.exports = {
	runInteraction,
}
