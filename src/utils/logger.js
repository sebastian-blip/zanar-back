import { createLogger, format, transports } from 'winston';

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

const logger = createLogger({
	exitOnError: false,
	format: format.combine(
		format.splat(),
		format.simple(),
		format.timestamp(),
		format.printf(info => `[${info.timestamp}] - [${info.level}]: "${info.message}"`)
	),
	transports: [
		new transports.File({
			maxsize: 5120000,
			maxFile: 10,
			filename: `${__dirname}/../logs/log-gana.log`
		})
	]
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(new transports.Console());
}

const traceError = (sbMethod, obError) => {
	let sbMessage = `Method: ${sbMethod} `;
	const blGanaError = Object.prototype.hasOwnProperty.call(obError, 'response');
	if (blGanaError) {
		sbMessage += `GanaError: ${obError.response.data.mensaje}`;
	} else {
		sbMessage += `Name: ${obError.name},  Error: ${obError.message}`;
	}
	logger.log('error', `${sbMessage}, ErrorJson: %o`, obError);
};

const traceBegin = sbText => {
	logger.log('info', 'Begin %s', sbText);
};

const traceEnd = sbText => {
	logger.log('info', 'End %s', sbText);
};

const traceFilter = (sbMethod, obFilter) => {
	logger.log('info', 'Method: %s. FilterJson: %o', sbMethod, obFilter);
};

const traceDebug = (sbTitle, obMessage, blObject) => {
	if (blObject) {
		logger.log('debug', 'Title: %s. Value: %s', sbTitle, obMessage);
	} else {
		logger.log('debug', 'Title: %s. Json: %o', sbTitle, obMessage);
	}
};

export { traceError, traceBegin, traceEnd, traceFilter, traceDebug };
