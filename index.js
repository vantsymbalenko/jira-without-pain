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

	// create tasks and save their id
	// for (let i = 0; i < tasks.length; ++i) {
	// 	await page.click('a#create_link')
	// 	await page.waitForSelector('#quick-issuetype')
	// 	await page.select('#quick-issuetype', '3')
	// 	await page.click('#quick-create-button')
	// 	await page.waitForSelector('#summary')

	// 	switch (typeof tasks[i]) {
	// 		case 'string':
	// 			await page.type('#sumary', tasks[i])
	// 			break
	// 		case 'object':
	// 			await page.type('')
	// 	}

	// 	await page.type('#summary', tasks[i].taskName)
	// 	await page.click('#create_submit')

	// 	await page.waitForSelector('#key-val')
	// 	const aWithTaskID = await page.$('#key-val')
	// 	const text = await page.evaluate(element => element.textContent, aWithTaskID)
	// 	tasks[i].taskID = text
	// 	await page.goto('http://jira.n-cube.co.uk:8099/browse/CMT-423', {
	// 		waitUntil: 'networkidle2',
	// 		timeout: 3000000,
	// 	})
	// 	await page.click("a[title='Log work']")
	// 	// await page.waitForNavigation()
	// 	await page.waitForSelector("input[name='timeLogged']")
	// 	await page.type("input[name='timeLogged']", '8')

	// 	const dateInput = await page.$('#date_startDate')
	// 	await dateInput.click({ clickCount: 3 })

	// 	await dateInput.type(`03/Jun/19 09:00 AM`)
	// 	await page.type('textarea[name="comment"]', 'some description')
	// 	await page.click('#log_submit')
	// 	await page.waitForNavigation()
	// }

	// log work
	// for (let i = 0; i < tasks.length; ++i) {

	// await page.waitForSelector("a.day[href$='01062019']");
	// page.on('requestfailed', async request => {
	//     request.abort();
	// if(request.url() === "http://jira.n-cube.co.uk:8099/styles/combined.css"){
	//     request.abort();
	// }
	// request.continue();
	// })
	// Promise.all([
	//     page.goto(timesheetPage),
	//     page.waitForNavigation(),
	//     page.click("a.day[href$='01062019']"),
	//     page.waitForSelector('input[value="Log Work"]'),
	//     page.click('input[value="Log Work"]')
	// ])
	// await page.goto(timesheetPage)
	// await page.waitForNavigation()
	// await page.click("a.day[href$='01062019']")
	// await page.waitForNavigation();
	// // await page.waitForSelector('input[value="Log Work"]')
	// await page.click('input[value="Log Work"]')
	// await
	// await
	// await
	// await
	// await page.waitForSelector("#linkKey");
	// await page.type("#linkKey", tasks[i].taskID)
	// }

	await browser.close()
}

module.exports = {
	runInteraction,
}
