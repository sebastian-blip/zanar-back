import Sequelize from 'sequelize';
import moment from 'moment';
import { ApolloError } from 'apollo-server-errors';
import ResourceService from '../../../database/mySql/resourceDao/resourceDao';
import Models, { sequelize as Connection, sequelize } from '../../../database/mySql';
import { MESSAGES } from '../utils/messages';
import { TURN_ARRAY } from '../utils/constants';
import _ from 'lodash';

export class MedicalAppoitmentService extends ResourceService {
	constructor() {
		super(Models.MedicalReminder, 'Medical Appoitment');
		this.dateFormat = 'YYYY-MM-DD';
		this.timeFormat = 'HH:mm';
		this.datetimeFormat = `${this.dateFormat} ${this.timeFormat}`;
	}

	getIncludeQuery() {
		return [
			{
				model: Models.User,
				as: 'Patient',
				required: true
			},
			{
				model: Models.User,
				as: 'Doctor',
				required: true
			},
			{
				model: Models.ConsultingRooms,
				as: 'ConsultingRoom',
				required: true
			}
		];
	}

	inputAdapter(medicalAppoitmentData) {
		let renameFields = {
			date: 'reminder_date',
			start_time: 'reminder_time'
		};
		let newInput = { ...medicalAppoitmentData };

		for (let field in renameFields) {
			if (medicalAppoitmentData[field])
				newInput[renameFields[field]] = medicalAppoitmentData[field];
		}

		return newInput;
	}

	outputAdapter(medicalAppoitment) {
		return {
			...medicalAppoitment,
			date: medicalAppoitment.reminder_date,
			start_time: medicalAppoitment.reminder_time,
			end_time: medicalAppoitment.reminder_duration,
			status: medicalAppoitment.reminder_status ? 'Active' : 'Cancelled'
		};
	}

	async generateTimes(date, strStartTime, strEndTime) {
		let startTime = moment(`${date} ${strStartTime}`);
		let endTime = moment(`${date} ${strEndTime}`);
		let timeArray = [];
	}

	async checkAvailableSchedule(appoitmentData, opts = {}) {
		if (!TURN_ARRAY.includes(appoitmentData.turn.toLowerCase()))
			throw new Error(MESSAGES.ERROR.turn_value_is_not_valid);

		if (moment(moment().format('YYYY-MM-DD')).isAfter(moment(appoitmentData.reminder_date)))
			throw new Error(MESSAGES.ERROR.date_value_is_not_valid);

		const strDate = moment(appoitmentData.reminder_date).format(this.dateFormat);
		//Get Schedule of office (consulting room)
		const scheduleDay = await Models.OfficeSchedules.findOne({
			...opts,
			attributes: [appoitmentData.turn.toLowerCase()],
			include: {
				model: Models.ConsultingRooms,
				attributes: ['id', 'duration_of_appointment'],
				where: {
					doctor_id: appoitmentData.doctor_id
				},
				required: true
			},
			where: {
				date: appoitmentData.reminder_date,
				consulting_rooms_id: appoitmentData.consulting_room_id,
				[appoitmentData.turn]: {
					[Sequelize.Op.or]: {
						[Sequelize.Op.not]: null,
						[Sequelize.Op.ne]: ''
					}
				}
			}
		});

		if (scheduleDay) {
			const schedule = scheduleDay[appoitmentData.turn.toLowerCase()];
			const [strStartTime, strEndTime] = schedule.split('a').map(e => e.trim());

			if (strStartTime && strEndTime) {
				const duration = Number.parseInt(scheduleDay.ConsultingRoom.duration_of_appointment);
				const startTime = moment(`${strDate} ${strStartTime}`);
				const endTime = moment(`${strDate} ${strEndTime}`);
				const appoitmentStartTime = moment(`${strDate} ${appoitmentData.reminder_time}`);
				const appoitmentEndTime = appoitmentStartTime.clone().add(duration, 'minutes');

				appoitmentData.reminder_duration = appoitmentEndTime.format(this.timeFormat);

				if (
					!(
						startTime.isSameOrBefore(appoitmentStartTime) &&
						appoitmentEndTime.isSameOrBefore(endTime)
					)
				)
					throw new Error(MESSAGES.ERROR.time_value_is_not_valid);

				const appoitmentTotal = await this.model.count({
					where: {
						id: {
							[Sequelize.Op.ne]: appoitmentData.id || -1
						},
						doctor_id: appoitmentData.doctor_id,
						consulting_room_id: appoitmentData.consulting_room_id,
						reminder_status: true,
						reminder_date: appoitmentData.reminder_date,
						[Sequelize.Op.and]: [
							Sequelize.literal(
								`CAST('${appoitmentStartTime
									.clone()
									.add(1, 'minutes')
									.format(this.timeFormat)}' AS TIME) BETWEEN reminder_time AND reminder_duration`
							)
						]
					}
				});

				if (appoitmentTotal > 0) throw new Error(MESSAGES.ERROR.schedule_is_not_available);
				//Add appoitment end time
			}
		} else {
			throw new Error(MESSAGES.ERROR.consulting_room_is_not_available);
		}
	}

	async create(data, opts = {}) {
		let transaction;
		let medicalAppoitment = undefined;
		try {
			transaction = opts.transaction || (await Connection.transaction());

			let inputData = {
				...this.inputAdapter(data),
				reminder_status: 1
			};

			await this.checkAvailableSchedule(inputData, { transaction });

			medicalAppoitment = await super.create(inputData, { transaction });
			medicalAppoitment = await this.get(medicalAppoitment.id, { transaction, applyAdapter: true });

			if (!opts.transaction) transaction.commit();

			return medicalAppoitment;
		} catch (error) {
			if (transaction && !opts.transaction) {
				transaction.rollback(error);
			}
			throw error;
		}
	}

	async update(appoitmentId, data, opts = {}) {
		let transaction;
		let medicalAppoitment = undefined;
		try {
			transaction = opts.transaction || (await Connection.transaction());

			medicalAppoitment = await this.get(appoitmentId, { transaction });

			if (!medicalAppoitment || !medicalAppoitment?.reminder_status)
				throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}FindError`);

			let inputData = {
				...medicalAppoitment.toJSON(),
				...this.inputAdapter(data)
			};
			console.log('>>>>>>>>>>>>>>>>>', inputData);
			await this.checkAvailableSchedule(inputData, { transaction });

			medicalAppoitment = await super.update(appoitmentId, inputData, { transaction });
			medicalAppoitment = await this.get(appoitmentId, { transaction, applyAdapter: true });

			if (!opts.transaction) transaction.commit();

			return medicalAppoitment;
		} catch (error) {
			if (transaction && !opts.transaction) {
				transaction.rollback(error);
			}
			throw error;
		}
	}

	async get(appoitmentId, opts = {}) {
		const appoitment = await super.get(appoitmentId, opts);

		if (appoitment && opts.applyAdapter) {
			return this.outputAdapter(appoitment.toJSON());
		}

		return appoitment;
	}

	async delete(appoitmentId, opts = {}) {
		return await this.update(appoitmentId, { reminder_status: false }, opts);
	}

	parseFilters(filters) {
		let newFilters = { ...filters };

		if (filters.status) {
			newFilters.reminder_status = filters.status == 'Active';
			delete newFilters.status;
		}

		if(filters.date){
			newFilters.reminder_date = moment(filters.date).format(this.dateFormat);
			delete newFilters.date;
		}

		return newFilters;
	}

	async getAll(filters = {}, pagination = { page: 0, pageSize: 100 }) {
		const _this = this;
		const result = await super.getAll(filters, pagination);

		result.records = result.records.map(r => _this.outputAdapter(r.toJSON()));

		return result;
	}
}

export const medicalAppoitmentService = new MedicalAppoitmentService();

export default MedicalAppoitmentService;
