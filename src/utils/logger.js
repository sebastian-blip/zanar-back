/*
@Author: Daniel Reyes Betancourt 
@Description: Logic to keep an error log
@Date: 15/10/2019
@Version: 1.0 
*/
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import winston from 'winston';
import 'moment-timezone';
import 'winston-daily-rotate-file';

/*
Error levels 
const levels = { 
  error: 0, 
  warn: 1, 
  info: 2, 
  verbose: 3, 
  debug: 4, 
  silly: 5 
};
*/

const timestamp = () =>
	moment()
		.tz('America/New_York')
		.format('YYYY-MM-DDTHH:mm:ssZ');

const printfFormat = winston.format.printf(
	info => `{ "time": "${timestamp()}",  "level":"${info.level}", "data":${info.message}}`
);

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
	datePattern: 'YYYY-MM-DD',
	maxSize: '20m',
	maxFiles: '15d',
	filename: `${__dirname}/../../logs/zanar-log-%DATE%.log`
});

// const jsonFile = new winston.transports.File({
//     filename: `${__dirname}/../../logs/tlab.json.log`,
//     level: 'info',
//     json: true,
//     eol: '\n', // for Windows, or `eol: '\n',` for *NIX OSs
//     timestamp: true
// });

// General instance of the logger
const logger = winston.createLogger({
	exitOnError: false,
	// format  print  text
	format: winston.format.combine(winston.format.splat(), winston.format.simple(), printfFormat),
	// file manager log
	transports: [dailyRotateFileTransport]
});

// Print on console whether if not a production environment
if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console());
}

/**
 * @Description: Log an error
 * @param {string} sbMethod Method name
 * @param {{}} obError Object error
 */
const traceError = (sbMethod, obError, logId) => {
	logger.log('error', '{ "logId":"%s", "method": "%s", "error": %o}', logId, sbMethod, obError);
};

/**
 * @Description: Log the beginning of a method
 * @param {string} sbText Method name
 */
const traceBegin = (sbText, logId) => {
	logger.log(
		'info',
		'{"logId":"%s", "method": "%s", "message": "Begin %s"}',
		logId,
		sbText,
		sbText
	);
};

/**
 * @Description: Log the end of a method
 * @param {string} sbText Method name
 */
const traceEnd = (sbText, logId) => {
	logger.log('info', '{"logId":"%s", "method": "%s", "message": "End %s"}', logId, sbText, sbText);
};

/**
 * @Description: Log the filter of a method
 * @param {string} sbMethod Method name
 * @param {{}} obFilter Object filter
 */
const traceFilter = (sbMethod, obFilter, logId) => {
	const filter = typeof obFilter === 'object' ? JSON.stringify(obFilter) : obFilter;
	logger.log('info', '{"logId":"%s", "method": "%s", "parameters": %s}', logId, sbMethod, filter);
};

/**
 * @Description: Get a log id
 */
const getLogId = () => {
	return uuidv4();
};

export { traceError, traceBegin, traceEnd, traceFilter, getLogId, logger };
