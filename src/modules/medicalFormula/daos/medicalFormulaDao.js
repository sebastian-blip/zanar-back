import moment from 'moment';
import Models, { sequelize } from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class MedicalFormulaDao extends ResourceDao {
	constructor() {
		super(Models.MedicalFormulas, 'MedicalFormulas');
		this.User = Models.User;
		this.ServiceProviderEPS = Models.ServiceProviderEPS;
		this.ManualMedications = Models.ManualMedications;
		this.ManualProcedureLaboratory = Models.ManualProcedureLaboratory;
		this.MedicalFormulaMedicines = Models.MedicalFormulaMedicines;
		this.MedicalFormulaLaboratory = Models.MedicalFormulaLaboratory;
		this.MedicalFormulaProcedures = Models.MedicalFormulaProcedures;
		this.DiagnosisDiseases = Models.DiagnosisDiseases;
		this.Diseases = Models.Diseases;
	}

	getIncludeQuery() {
		return [
			{
				model: this.User,
				as: 'Doctor'
			},
			{
				model: this.User,
				as: 'Patient'
			},
			{
				model: this.ManualMedications
			},
			{
				model: this.ManualProcedureLaboratory
			},
			{
				model: this.MedicalFormulaMedicines
			},
			{
				model: this.MedicalFormulaLaboratory
			},
			{
				model: this.MedicalFormulaProcedures
			},
			{
				model: this.DiagnosisDiseases,
				include: [
					{
						model: this.Diseases
					}
				]
			}
		];
	}

	async getMedicalFormulaList(
		filters = {},
		pagination = { page: 0, pageSize: 100 },
		orderBy = 'createdAt',
		sortBy = 'DESC'
	) {
		// eslint-disable-next-line camelcase
		const { code, initialDate, finalDate, doctor_id, patient_id } = filters;
		let where = '1 = 1 ';
		if (code) where += `AND MedicalFormulas.code LIKE '%${code}%'`;
		if (initialDate && finalDate)
			where += `AND MedicalFormulas.createdAt BETWEEN
			CAST('${moment(initialDate).format('YYYY-MM-DD')}' AS DATE) AND
			CAST('${moment(finalDate).format('YYYY-MM-DD')}' AS DATE) `;
		// eslint-disable-next-line camelcase
		if (doctor_id)
			// eslint-disable-next-line camelcase
			where += `AND MedicalFormulas.doctor_id = ${doctor_id} `;
		// eslint-disable-next-line camelcase
		if (patient_id)
			// eslint-disable-next-line camelcase
			where += `AND MedicalFormulas.patient_id = ${patient_id} `;
		where = sequelize.literal(where);
		const query = {
			where,
			paranoid: true,
			...this.calcPagination(pagination.page, pagination.pageSize),
			order: [[orderBy, sortBy]]
		};
		const total = await this.model.count(query);
		const records = await this.model.findAll(query);
		const response = {
			total,
			count: records.length,
			page: pagination ? pagination.page : 0,
			records
		};
		return response;
	}
}

const medicalFormulaDao = new MedicalFormulaDao();

export { medicalFormulaDao };
