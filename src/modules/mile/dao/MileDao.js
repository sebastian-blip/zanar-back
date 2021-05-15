import moment from 'moment';
import Models, { sequelize } from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class MileDao extends ResourceDao {
	constructor() {
		super(Models.Miles, 'Miles');
	}

	getCurrentMilesForSalesByDoctor(doctorId) {
		return this.model.sum('mile', {
			where: { doctor_id: doctorId, sync: true, exchange: false },
			group: ['doctor_id'],
			raw: true
		});
	}

	getTotalMilesByDoctor(doctorId, monthNumber = '') {
		const where =
			monthNumber === ''
				? sequelize.literal(`Miles.doctor_id = ${doctorId}`)
				: sequelize.literal(
						`Miles.doctor_id = ${doctorId} AND MONTH(DATE(Miles.createdAt)) = ${monthNumber}`
				  );
		return this.model.findOne({
			attributes: [
				[
					sequelize.fn(
						'SUM',
						sequelize.literal(
							'CASE WHEN Miles.sync = 1 AND Miles.exchange = 0 THEN Miles.mile ELSE 0 END'
						)
					),
					'sale'
				],
				[
					sequelize.fn(
						'SUM',
						sequelize.literal(
							'CASE WHEN Miles.sync = 0 AND Miles.exchange = 0 THEN Miles.mile ELSE 0 END'
						)
					),
					'notConfirmed'
				],
				[
					sequelize.fn(
						'SUM',
						sequelize.literal(
							'CASE WHEN Miles.exchange = 1 AND Miles.sync = 1  THEN Miles.mile ELSE 0 END'
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
	}

	getMaxMilesByDoctorAndMonth(doctorId, monthNumber) {
		return this.model.max('mile', {
			where: sequelize.literal(
				`Miles.doctor_id = ${doctorId} AND MONTH(DATE(Miles.createdAt)) = ${monthNumber}`
			),
			raw: true
		});
	}

	getLastMilesByDoctor(doctorId) {
		return this.model.findOne({
			attributes: [
				[sequelize.fn('SUM', sequelize.literal('Miles.mile')), 'lastPoints'],
				[sequelize.literal('DATE(Miles.createdAt)'), 'lastPointsMonth']
			],
			where: sequelize.literal(
				`Miles.doctor_id = ${doctorId} AND DATE(Miles.createdAt) <= '${moment().format(
					'YYYY-MM-DD'
				)}'`
			),
			group: sequelize.literal(`Miles.doctor_id, DATE(Miles.createdAt)`),
			order: [['createdAt', 'DESC']],
			raw: true
		});
	}

	async getMilesByDoctor(doctorId, date) {
		const monthNumber = moment(date).format('M');
		const totalMilesByDoctor = (await this.getTotalMilesByDoctor(doctorId)) || {
			sale: 0,
			notConfirmed: 0,
			exchange: 0,
			total: 0
		};
		const maxMilesByDoctorAndMonth =
			(await this.getMaxMilesByDoctorAndMonth(doctorId, monthNumber)) || 0;
		const lastMilesByDoctor = (await this.getLastMilesByDoctor(doctorId)) || {
			lastPoints: 0,
			lastPointsMonth: monthNumber
		};
		return {
			...totalMilesByDoctor,
			...lastMilesByDoctor,
			maxPoint: maxMilesByDoctorAndMonth,
			maxPointMonth: monthNumber
		};
	}

	async getMilesPercentByDoctorAndMonth(doctorId, date) {
		const monthNumber = moment(date).format('M');
		const totalMilesByDoctor = (await this.getTotalMilesByDoctor(doctorId, monthNumber)) || {
			sale: 0,
			notConfirmed: 0,
			exchange: 0,
			total: 0
		};
		const { sale, notConfirmed, exchange, total } = totalMilesByDoctor;
		return {
			...totalMilesByDoctor,
			salePercent: Math.round(sale === 0 ? 0 : (sale * 100) / total),
			notConfirmedPercent: Math.round(notConfirmed === 0 ? 0 : (notConfirmed * 100) / total),
			exchangePercen: Math.round(exchange === 0 ? 0 : (exchange * 100) / total),
			month: monthNumber
		};
	}

	getMilesHistoryByDoctor(doctorId, initDate, finalDate) {
		return this.model.findAll({
			attributes: [
				[sequelize.fn('SUM', sequelize.literal('Miles.mile')), 'total'],
				[sequelize.literal('DATE(Miles.createdAt)'), 'date'],
				['number_order', 'order']
			],
			where: sequelize.literal(
				`Miles.sync = 1 AND Miles.doctor_id = ${doctorId} AND Miles.createdAt BETWEEN
					CAST('${moment(initDate).format('YYYY-MM-DD')}' AS DATE) AND
					CAST('${moment(finalDate).format('YYYY-MM-DD')}' AS DATE)
				`
			),
			group: sequelize.literal(`Miles.doctor_id, Miles.number_order, DATE(Miles.createdAt)`),
			order: [['createdAt', 'DESC']],
			raw: true
		});
	}

	getUnsyncedMiles() {
		return this.model.findAll({ where: { sync: false } });
	}
}

const mileDao = new MileDao();

export { mileDao };
