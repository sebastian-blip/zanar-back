import { mileDao } from '../dao/MileDao';

const getMilesByDoctor = (doctorId, date) => {
	return mileDao.getMilesByDoctor(doctorId, date);
};

const getMilesHistoryByDoctor = (doctorId, initDate, finalDate) => {
	return mileDao.getMilesHistoryByDoctor(doctorId, initDate, finalDate);
};

const getMilesPercentByDoctorAndMonth = (doctorId, date) => {
	return mileDao.getMilesPercentByDoctorAndMonth(doctorId, date);
};

export { getMilesByDoctor, getMilesHistoryByDoctor, getMilesPercentByDoctorAndMonth };
