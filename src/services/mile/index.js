import * as milesDao from '../../dao/miles';

const getMilesByDoctor = (root, { doctorId, date }) => {
	return milesDao.getMilesByDoctor(doctorId, date);
};

const getMilesHistoryByDoctor = (root, { doctorId, initDate, finalDate }) => {
	return milesDao.getMilesHistoryByDoctor(doctorId, initDate, finalDate);
};

const getMilesPercentByDoctorAndMonth = (root, { doctorId, date }) => {
	return milesDao.getMilesPercentByDoctorAndMonth(doctorId, date);
};

export { getMilesByDoctor, getMilesHistoryByDoctor, getMilesPercentByDoctorAndMonth };
