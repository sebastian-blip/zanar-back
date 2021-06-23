import { officeScheduleDao } from '../dao/officeScheduleDao';
import { consultingRoomsDao } from '../../consultingRoom/dao/consultingRoomDao';
import { getAndValidateDateByHour } from '../../../utils/validate/time/timeValidate';
import * as DefaultMessages from '../../../utils/messages/default/default.json';

const isBetween = (date, dateToCompare) => {
	if (
		date.initialDate.isBetween(dateToCompare.initialDate, dateToCompare.finalDate) ||
		date.finalDate.isBetween(dateToCompare.initialDate, dateToCompare.finalDate) ||
		(date.initialDate.isSame(dateToCompare.initialDate) &&
			date.finalDate.isSame(dateToCompare.finalDate))
	)
		throw new Error(DefaultMessages.timeError);
};

const isNotBetween = (date, dateToCompare) => {
	if (
		!date.initialDate.isBetween(
			dateToCompare.initialDate,
			dateToCompare.finalDate,
			undefined,
			'[]'
		) ||
		!date.finalDate.isBetween(dateToCompare.initialDate, dateToCompare.finalDate, undefined, '[]')
	)
		throw new Error(DefaultMessages.timeError);
};

// eslint-disable-next-line camelcase
const validTime = async ({ consulting_rooms_id, date, morning, afternoon, night }) => {
	// Se valida que solo venga un campo de hora
	if (
		(morning && afternoon && night) ||
		(!morning && !afternoon && !night) ||
		(!morning && afternoon && night) ||
		(morning && !afternoon && night) ||
		(morning && afternoon && !night)
	)
		throw new Error(DefaultMessages.timeError);
	// Se valida que la disponibilidad esté en los rangos definidos
	let currentDateFormat;
	const consultingRoom = await consultingRoomsDao.get(consulting_rooms_id);
	const {
		morning: morningConsultingRoom,
		afternoon: afternoonConsultingRoom,
		night: nightConsultingRoom
	} = consultingRoom;
	if (morning) {
		currentDateFormat = getAndValidateDateByHour(morning);
		const morningConsultingRoomDate = getAndValidateDateByHour(morningConsultingRoom);
		isNotBetween(currentDateFormat, morningConsultingRoomDate);
	}
	if (afternoon) {
		currentDateFormat = getAndValidateDateByHour(afternoon);
		const afternoonConsultingRoomDate = getAndValidateDateByHour(afternoonConsultingRoom);
		isNotBetween(currentDateFormat, afternoonConsultingRoomDate);
	}
	if (night) {
		currentDateFormat = getAndValidateDateByHour(night);
		const nightConsultingRoomDate = getAndValidateDateByHour(nightConsultingRoom);
		isNotBetween(currentDateFormat, nightConsultingRoomDate);
	}

	// Se valida que la disponibilidad no se cruce
	const officeShedules = await officeScheduleDao.getOfficeSchedulesByDoctor(
		consultingRoom.doctor_id,
		date
	);
	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < officeShedules.length; i++) {
		const officeShedule = officeShedules[i];
		let officeSheduleDateFormat;
		if (officeShedule.morning)
			officeSheduleDateFormat = getAndValidateDateByHour(officeShedule.morning);
		if (officeShedule.afternoon)
			officeSheduleDateFormat = getAndValidateDateByHour(officeShedule.afternoon);
		if (officeShedule.night)
			officeSheduleDateFormat = getAndValidateDateByHour(officeShedule.night);
		isBetween(currentDateFormat, officeSheduleDateFormat);
	}
};

const getOfficeScheduleDatesByMonth = (doctorId, date) => {
	return officeScheduleDao.getOfficeScheduleDatesByMonth(doctorId, date);
};

const getOfficeSchedulesByDoctor = (doctorId, date) => {
	return officeScheduleDao.getOfficeSchedulesByDoctor(doctorId, date);
};

const create = async officeScheduleData => {
	await validTime(officeScheduleData);
	const record = await officeScheduleDao.create(officeScheduleData);
	return record.id;
};

const update = async (id, officeScheduleData) => {
	await validTime(officeScheduleData);
	await officeScheduleDao.update(id, officeScheduleData);
	return DefaultMessages.updateMessage;
};

const deleteRow = async id => {
	await officeScheduleDao.delete(id);
	return DefaultMessages.deleteMessage;
};

export { getOfficeScheduleDatesByMonth, getOfficeSchedulesByDoctor, create, update, deleteRow };
