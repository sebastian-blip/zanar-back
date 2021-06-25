import moment from 'moment';
import * as DefaultMessages from '../../messages/default/default.json';

const getAndValidateDateByHour = hours => {
	const splitHours = hours.split('-');
	if (splitHours[0] === splitHours[1]) throw new Error(DefaultMessages.timeError);
	const hour1 = splitHours[0].split(':')[0];
	const hour2 = splitHours[1].split(':')[0];
	const minutes1 = splitHours[0].split(':')[1];
	const minutes2 = splitHours[1].split(':')[1];
	const initialDate = moment().set({
		hour: hour1,
		minute: minutes1,
		second: 0,
		millisecond: 0
	});
	const finalDate = moment().set({
		hour: hour2,
		minute: minutes2,
		second: 0,
		millisecond: 0
	});
	if (finalDate.isBefore(initialDate)) throw new Error(DefaultMessages.timeError);
	return {
		initialDate,
		finalDate
	};
};

const areValidHours = (initialDatesHours, finalDatesHours) => {
	const hourFormat = 'hh:mm:ss';
	let time = moment(initialDatesHours.initialDate, hourFormat);
	const beforeTime = moment(finalDatesHours.initialDate, hourFormat);
	const afterTime = moment(finalDatesHours.finalDate, hourFormat);
	if (time.isBetween(beforeTime, afterTime)) throw new Error(DefaultMessages.timeError);
	time = moment(initialDatesHours.finalDate, hourFormat);
	if (time.isBetween(beforeTime, afterTime)) throw new Error(DefaultMessages.timeError);
};

const validHours = ({ morning, afternoon, night }) => {
	if (morning === null || afternoon === null || night === null)
		throw new Error(DefaultMessages.timeError);
	const morningDate = morning ? getAndValidateDateByHour(morning) : null;
	const afternoonDate = afternoon ? getAndValidateDateByHour(afternoon) : null;
	const nightDate = night ? getAndValidateDateByHour(night) : null;
	if (morningDate && afternoonDate) areValidHours(morningDate, afternoonDate);
	if (afternoonDate && nightDate) areValidHours(afternoonDate, nightDate);
	if (morningDate && nightDate) areValidHours(morningDate, nightDate);
};

export { areValidHours, validHours, getAndValidateDateByHour };
