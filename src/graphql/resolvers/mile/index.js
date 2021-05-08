import {
	getMilesByDoctor,
	getMilesHistoryByDoctor,
	getMilesPercentByDoctorAndMonth
} from '../../../services/mile';

const mileQueries = {
	getMilesByDoctor,
	getMilesHistoryByDoctor,
	getMilesPercentByDoctorAndMonth
};

// eslint-disable-next-line import/prefer-default-export
export { mileQueries };
