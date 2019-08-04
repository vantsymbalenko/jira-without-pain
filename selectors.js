// sign in page
const LOGIN_LINK_JIRA = process.env.LOCAL
	? 'http://localhost:3000/login'
	: 'http://jira.n-cube.co.uk:8099/secure/Dashboard.jspa'
const SIGN_IN_FORM_IFRAME_SELECTOR = 'gadget-0'
const SIGN_IN_LOGIN_INPUT_SELECTOR = 'input[type="text"]'
const SIGN_IN_PASSWORD_INPUT_SELECTOR = 'input[type="password"]'
const SUBMIT_BUTTON_SELECTOR = "input[type='submit']"
// create task popover
const CREATE_TASK_POPOVER_OPEN_LINK = 'a#create_link'
const CREATE_TASK_POPOVER_POPOVER = '#quick-issuetype'
const CREATE_TASK_POPOVER_SELECT_TYPE = '#quick-issuetype'
const CREATE_TASK_POPOVER_SUBMIT_BUTTON = '#quick-create-button'
// create task form page
const SUMMARY_PAGE_SUMMARY_FIELD = '#summary'
const SUMMARY_PAGE_SUBMIT_BUTTON = '#create_submit'
// task details page
const TASK_DETAILS_PAGE_TASK_ID_LINK = '#key-val'
// log work hours page
const LOG_WORK_URL = process.env.LOCAL ? 'http:/localhost:3000/log-work/' : 'http://jira.n-cube.co.uk:8099/browse/'
const LOG_WORK_LOG_BUTTON = "a[title='Log work']"
const LOG_WORK_SPENT_HOURS_INPUT = "input[name='timeLogged']"
const LOG_WORK_DATE_INPUT = '#date_startDate'
const LOG_WORK_COMMENT_INPUT = 'textarea[name="comment"]'
const LOG_WORK_SUBMIT_BUTTON = '#log_submit'

module.exports = {
	LOGIN_LINK_JIRA,
	SIGN_IN_FORM_IFRAME_SELECTOR,
	SIGN_IN_LOGIN_INPUT_SELECTOR,
	SIGN_IN_PASSWORD_INPUT_SELECTOR,
	SUBMIT_BUTTON_SELECTOR,
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
}
