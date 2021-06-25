import Sequelize from 'sequelize';
import moment from 'moment';
import { ApolloError } from 'apollo-server-errors';
import ResourceService from '../../../database/mySql/resourceDao/resourceDao';
import Models, { sequelize } from '../../../database/mySql';

export class MileForSaleService extends ResourceService {
	constructor() {
		super(Models.MileForSale, 'Miles');
		this.dateFormat = 'YYYY-MM-DD';
	}

	getIncludeQuery() {
		return [
			{
				model: Models.User,
				as: 'doctor',
				required: true
			},
			{
				model: Models.MedicalFormulas,
				as: 'medicalFormula',
				required: true
			},
			{
				model: Models.MedicalFormulaOrder,
				as: 'medicalFormulaOrder',
				required: true,
				where: {
					is_invoiced: true
				}
			}
		];
	}

	parseFilters(filters) {
		const conditions = [];
		if (filters.created_at) {
			const initDate = moment(filters.created_at.init_date).format(this.dateFormat);
			const endDate = moment(filters.created_at.end_date).format(this.dateFormat);

			conditions.push(
				Sequelize.literal(`Date(MileForSale.created_at) BETWEEN '${initDate}' AND '${endDate}' `)
			);

			delete filters.created_at;
		}

		conditions.push(filters);

		return {
			[Sequelize.Op.and]: conditions
		};
	}

	async getMilesGroupedByMedicalFormula(filters = {}, pagination = { page: 0, pageSize: 100 }) {
		const include = [
			{
				model: Models.User,
				as: 'doctor',
				required: true
			},
			{
				model: Models.MedicalFormulas,
				as: 'medicalFormula',
				required: true
			},
			{
				model: Models.MedicalFormulaOrder,
				attributes: [],
				as: 'medicalFormulaOrder',
				required: true,
				where: {
					is_invoiced: true
				}
			}
		];
		let query = {
			attributes: [[sequelize.fn('SUM', sequelize.col('mile')), 'mileAmount']],
			include,
			where: this.parseFilters(filters),
			paranoid: true,
			group: [Sequelize.col('doctor.id'), Sequelize.col('medicalFormula.id')]
		};

		if (pagination)
			query = {
				...query,
				...this.calcPagination(pagination.page, pagination.pageSize)
			};
		const total = await this.model.findOne({
			include: [
				{
					model: Models.User,
					attributes: [],
					as: 'doctor',
					required: true
				},
				{
					model: Models.MedicalFormulas,
					attributes: [],
					as: 'medicalFormula',
					required: true
				},
				{
					model: Models.MedicalFormulaOrder,
					attributes: [],
					as: 'medicalFormulaOrder',
					required: true,
					where: {
						is_invoiced: true
					}
				}
			],
			attributes: [
				[sequelize.fn('COUNT', sequelize.literal(`DISTINCT medicalFormula.id`)), 'total']
			],
			where: this.parseFilters(filters),
			group: [Sequelize.col('doctor.id'), Sequelize.col('medicalFormula.id')],
			orderBy: [Sequelize.col('medicalFormula.createdAt')]
		});
		const records = (await this.model.findAll(query)).map(r => r.toJSON());
		const response = {
			total: total ? total.toJSON().total : null,
			count: records.length,
			page: pagination ? pagination.page : 0,
			records
		};

		return response;
	}

	// REPORT
	parseReportFilters(filters) {
		const conditions = [];

		if (filters.created_year || filters.created_month) {
			if (filters.created_at && filters.created_month) {
				conditions.push(
					Sequelize.literal(`YEAR(MileForSale.created_at) = ${filters.created_year} `)
				);
				conditions.push(
					Sequelize.literal(`MONTH(MileForSale.created_at) = ${filters.created_month} `)
				);

				delete filters.created_year;
				delete filters.created_month;
			} else {
				throw new ApolloError(`You have to send both parameters, created_year and created_month`);
			}
		}

		if (filters.created_at) {
			const initDate = moment(filters.created_at.init_date).format(this.dateFormat);
			const endDate = moment(filters.created_at.end_date).format(this.dateFormat);

			conditions.push(
				Sequelize.literal(`Date(MileForSale.created_at) BETWEEN '${initDate}' AND '${endDate}' `)
			);

			delete filters.created_at;
		}
		conditions.push(filters);

		return {
			[Sequelize.Op.and]: conditions
		};
	}

	async getReport(filters = {}) {
		const total = await this.model.findOne({
			include: [
				{
					model: Models.User,
					attributes: [],
					as: 'doctor',
					required: true
				},
				{
					model: Models.MedicalFormulas,
					attributes: [],
					as: 'medicalFormula',
					required: true
				},
				{
					model: Models.MedicalFormulaOrder,
					attributes: [],
					as: 'medicalFormulaOrder',
					required: true,
					where: {
						is_invoiced: true
					}
				}
			],
			attributes: [
				[
					sequelize.fn('COUNT', sequelize.literal(`DISTINCT medicalFormula.id`)),
					'medicalFormulaAmount'
				],
				[
					sequelize.fn('COUNT', sequelize.literal(`DISTINCT medicalFormulaOrder.id`)),
					'medicalFormulaOrderAmount'
				],
				[sequelize.fn('sum', sequelize.literal(`mile`)), 'mileAmount']
			],
			where: this.parseReportFilters(filters),
			group: [Sequelize.col('doctor.id')]
		});

		return total
			? total.toJSON()
			: {
					medicalFormulaAmount: 0,
					medicalFormulaOrderAmount: 0,
					mileAmount: 0
			  };
	}
}

export const mileForSaleService = new MileForSaleService();

export default MileForSaleService;
