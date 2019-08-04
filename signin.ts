import { Page, Frame } from 'puppeteer'

import {
	LOGIN_LINK_JIRA,
	SIGN_IN_FORM_IFRAME_SELECTOR,
	SIGN_IN_LOGIN_INPUT_SELECTOR,
	SIGN_IN_PASSWORD_INPUT_SELECTOR,
	SUBMIT_BUTTON_SELECTOR,
	CREATE_TASK_POPOVER_OPEN_LINK,
} from './selectors'

async function signIn(page: Page, JIRA_LOGIN: string, JIRA_PASSWORD: string) {
	await page.goto(LOGIN_LINK_JIRA)

	const frame: Frame = await page.frames().find((frame: Frame) => frame.name() === SIGN_IN_FORM_IFRAME_SELECTOR)
	await frame.type(SIGN_IN_LOGIN_INPUT_SELECTOR, JIRA_LOGIN)
	await frame.type(SIGN_IN_PASSWORD_INPUT_SELECTOR, JIRA_PASSWORD)
	await frame.click(SUBMIT_BUTTON_SELECTOR)
	await page.waitForSelector(CREATE_TASK_POPOVER_OPEN_LINK)
}

export { signIn }
