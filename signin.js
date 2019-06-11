const LOGIN_LINK_JIRA = 'http://jira.n-cube.co.uk:8099/secure/Dashboard.jspa'
const SIGN_IN_FORM_IFRAME_SELECTOR = 'gadget-0'
const SIGN_IN_LOGIN_INPUT_SELECTOR = 'input[type="text"]'
const SIGN_IN_PASSWORD_INPUT_SELECTOR = 'input[type="password"]'
const SUBMIT_BUTTON_SELECTOR = "input[type='submit']"

async function signIn(page, JIRA_LOGIN, JIRA_PASSWORD) {
	await page.goto(LOGIN_LINK_JIRA)

	const frame = await page.frames().find(frame => frame.name() === SIGN_IN_FORM_IFRAME_SELECTOR)
	await frame.type(SIGN_IN_LOGIN_INPUT_SELECTOR, JIRA_LOGIN)
	await frame.type(SIGN_IN_PASSWORD_INPUT_SELECTOR, JIRA_PASSWORD)
	await frame.click(SUBMIT_BUTTON_SELECTOR)
	await page.waitForNavigation()
}

module.exports = { signIn }
