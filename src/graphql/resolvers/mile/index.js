import * as mileService from '../../../services/mile';

const mileQueries = {
	getMilesByDoctor: (root, { doctorId, date }) => mileService.getMilesByDoctor(doctorId, date),
	getMilesHistoryByDoctor: (root, { doctorId, initDate, finalDate }) =>
		mileService.getMilesHistoryByDoctor(doctorId, initDate, finalDate),
	getMilesPercentByDoctorAndMonth: (root, { doctorId, date }) =>
		mileService.getMilesPercentByDoctorAndMonth(doctorId, date)
};

// eslint-disable-next-line import/prefer-default-export
export { mileQueries };
