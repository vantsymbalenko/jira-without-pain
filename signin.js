const {
	LOGIN_LINK_JIRA,
	SIGN_IN_FORM_IFRAME_SELECTOR,
	SIGN_IN_LOGIN_INPUT_SELECTOR,
	SIGN_IN_PASSWORD_INPUT_SELECTOR,
	SUBMIT_BUTTON_SELECTOR,
	CREATE_TASK_POPOVER_OPEN_LINK
} = require('./selectors')

async function signIn(page, JIRA_LOGIN, JIRA_PASSWORD) {
	await page.goto(LOGIN_LINK_JIRA)

	const frame = await page.frames().find(frame => frame.name() === SIGN_IN_FORM_IFRAME_SELECTOR)
	await frame.type(SIGN_IN_LOGIN_INPUT_SELECTOR, JIRA_LOGIN)
	await frame.type(SIGN_IN_PASSWORD_INPUT_SELECTOR, JIRA_PASSWORD)
	await frame.click(SUBMIT_BUTTON_SELECTOR)
	await page.waitForSelector(CREATE_TASK_POPOVER_OPEN_LINK)
}

// module.exports = { signIn }
export {signIn}
