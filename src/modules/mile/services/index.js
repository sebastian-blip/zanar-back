import * as milesDao from '../../../dao/miles';

const getMilesByDoctor = (doctorId, date) => {
	return milesDao.getMilesByDoctor(doctorId, date);
};

const getMilesHistoryByDoctor = (doctorId, initDate, finalDate) => {
	return milesDao.getMilesHistoryByDoctor(doctorId, initDate, finalDate);
};

const getMilesPercentByDoctorAndMonth = (doctorId, date) => {
	return milesDao.getMilesPercentByDoctorAndMonth(doctorId, date);
};

export { getMilesByDoctor, getMilesHistoryByDoctor, getMilesPercentByDoctorAndMonth };
