// sign in page
const LOGIN_LINK_JIRA: string = process.env.LOCAL
	? 'http://localhost:3000/login'
	: 'http://jira.n-cube.co.uk:8099/secure/Dashboard.jspa'
const SIGN_IN_FORM_IFRAME_SELECTOR: string = 'gadget-0'
const SIGN_IN_LOGIN_INPUT_SELECTOR: string = 'input[type="text"]'
const SIGN_IN_PASSWORD_INPUT_SELECTOR: string = 'input[type="password"]'
const SUBMIT_BUTTON_SELECTOR: string = "input[type='submit']"
// create task popover
const CREATE_TASK_POPOVER_OPEN_LINK: string = 'a#create_link'
const CREATE_TASK_POPOVER_POPOVER: string = '#quick-issuetype'
const CREATE_TASK_POPOVER_SELECT_TYPE: string = '#quick-issuetype'
const CREATE_TASK_POPOVER_SUBMIT_BUTTON: string = '#quick-create-button'
// create task form page
const SUMMARY_PAGE_SUMMARY_FIELD: string = '#summary'
const SUMMARY_PAGE_SUBMIT_BUTTON: string = '#create_submit'
// task details page
const TASK_DETAILS_PAGE_TASK_ID_LINK: string = '#key-val'
// log work hours page
const LOG_WORK_URL: string = process.env.LOCAL
	? 'http:/localhost:3000/log-work/'
	: 'http://jira.n-cube.co.uk:8099/browse/'
const LOG_WORK_LOG_BUTTON: string = "a[title='Log work']"
const LOG_WORK_SPENT_HOURS_INPUT: string = "input[name='timeLogged']"
const LOG_WORK_DATE_INPUT: string = '#date_startDate'
const LOG_WORK_COMMENT_INPUT: string = 'textarea[name="comment"]'
const LOG_WORK_SUBMIT_BUTTON: string = '#log_submit'

export {
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
