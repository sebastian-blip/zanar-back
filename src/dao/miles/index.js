import moment from 'moment';
import { sequelize } from '../../database/mySql';
// eslint-disable-next-line camelcase
const { miles_for_sales } = sequelize.models;

const getCurrentMilesForSalesByDoctor = doctorId => {
	return miles_for_sales.sum('mile', {
		where: { doctor_id: doctorId, sync: true, exchange: false },
		group: ['doctor_id'],
		raw: true
	});
};

const getTotalMilesByDoctor = (doctorId, monthNumber = '') => {
	const where =
		monthNumber === ''
			? sequelize.literal(`miles_for_sales.doctor_id = ${doctorId}`)
			: sequelize.literal(
					`miles_for_sales.doctor_id = ${doctorId} AND MONTH(DATE(miles_for_sales.createdAt)) = ${monthNumber}`
			  );
	return miles_for_sales.findOne({
		attributes: [
			[
				sequelize.fn(
					'SUM',
					sequelize.literal(
						'CASE WHEN miles_for_sales.sync = 1 AND miles_for_sales.exchange = 0 THEN miles_for_sales.mile ELSE 0 END'
					)
				),
				'sale'
			],
			[
				sequelize.fn(
					'SUM',
					sequelize.literal(
						'CASE WHEN miles_for_sales.sync = 0 AND miles_for_sales.exchange = 0 THEN miles_for_sales.mile ELSE 0 END'
					)
				),
				'notConfirmed'
			],
			[
				sequelize.fn(
					'SUM',
					sequelize.literal(
						'CASE WHEN miles_for_sales.exchange = 1 AND miles_for_sales.sync = 1  THEN miles_for_sales.mile ELSE 0 END'
					)
				),
				'exchange'
			],
			[sequelize.fn('SUM', sequelize.col('mile')), 'total']
		],
		where,
		group: ['doctor_id'],
		raw: true
	});
};

const getMaxMilesByDoctorAndMonth = (doctorId, monthNumber) => {
	return miles_for_sales.max('mile', {
		where: sequelize.literal(
			`miles_for_sales.doctor_id = ${doctorId} AND MONTH(DATE(miles_for_sales.createdAt)) = ${monthNumber}`
		),
		raw: true
	});
};

const getLastMilesByDoctor = doctorId => {
	return miles_for_sales.findOne({
		attributes: [
			[sequelize.fn('SUM', sequelize.literal('miles_for_sales.mile')), 'lastPoints'],
			[sequelize.literal('DATE(miles_for_sales.createdAt)'), 'lastPointsMonth']
		],
		where: sequelize.literal(
			`miles_for_sales.doctor_id = ${doctorId} AND DATE(miles_for_sales.createdAt) <= '${moment().format(
				'YYYY-MM-DD'
			)}'`
		),
		group: sequelize.literal(`miles_for_sales.doctor_id, DATE(miles_for_sales.createdAt)`),
		order: [['createdAt', 'DESC']],
		raw: true
	});
};

const getMilesByDoctor = async (doctorId, date) => {
	const monthNumber = moment(date).format('M');
	const totalMilesByDoctor = await getTotalMilesByDoctor(doctorId);
	const maxMilesByDoctorAndMonth = await getMaxMilesByDoctorAndMonth(doctorId, monthNumber);
	const lastMilesByDoctor = await getLastMilesByDoctor(doctorId);
	return {
		...totalMilesByDoctor,
		...lastMilesByDoctor,
		maxPoint: maxMilesByDoctorAndMonth,
		maxPointMonth: monthNumber
	};
};

const getMilesPercentByDoctorAndMonth = async (doctorId, date) => {
	const monthNumber = moment(date).format('M');
	const totalMilesByDoctor = await getTotalMilesByDoctor(doctorId, monthNumber);
	const { sale, notConfirmed, exchange, total } = totalMilesByDoctor;
	return {
		...totalMilesByDoctor,
		salePercent: Math.round(sale === 0 ? 0 : (sale * 100) / total),
		notConfirmedPercent: Math.round(notConfirmed === 0 ? 0 : (notConfirmed * 100) / total),
		exchangePercen: Math.round(exchange === 0 ? 0 : (exchange * 100) / total),
		month: monthNumber
	};
};

const getMilesHistoryByDoctor = (doctorId, initDate, finalDate) => {
	return miles_for_sales.findAll({
		attributes: [
			[sequelize.fn('SUM', sequelize.literal('miles_for_sales.mile')), 'total'],
			[sequelize.literal('DATE(miles_for_sales.createdAt)'), 'date'],
			['number_order', 'order']
		],
		where: sequelize.literal(
			`miles_for_sales.sync = 1 AND miles_for_sales.doctor_id = ${doctorId} AND miles_for_sales.createdAt BETWEEN
				CAST('${moment(initDate).format('YYYY-MM-DD')}' AS DATE) AND
				CAST('${moment(finalDate).format('YYYY-MM-DD')}' AS DATE)
			`
		),
		group: sequelize.literal(
			`miles_for_sales.doctor_id, miles_for_sales.number_order, DATE(miles_for_sales.createdAt)`
		),
		order: [['createdAt', 'DESC']],
		raw: true
	});
};

const getUnsyncedMiles = () => {
	return miles_for_sales.findAll({ where: { sync: false } });
};

const create = async mileData => {
	const record = await miles_for_sales.create(mileData);
	return record.id;
};

const update = (id, mileData) => {
	return miles_for_sales.update(mileData, { where: { id } });
};

const deleteRow = id => {
	return miles_for_sales.destroy({ where: { id } });
};

export {
	getCurrentMilesForSalesByDoctor,
	getMilesByDoctor,
	getMilesPercentByDoctorAndMonth,
	getMilesHistoryByDoctor,
	getUnsyncedMiles,
	create,
	update,
	deleteRow
};
