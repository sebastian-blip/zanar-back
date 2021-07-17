import * as medicalFormulaService from '../../services/medicalFormulaService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const medicalFormulaQueries = {
	getMedicalFormulas: (root, { filter, pagination, orderBy, sortBy }, context) => {
		isAuthenticate(context);
		return medicalFormulaService.getMedicalFormulas(filter, pagination, orderBy, sortBy);
	},
	getMedicalFormulaDetail: (root, { id }, context) => {
		isAuthenticate(context);
		return medicalFormulaService.getMedicalFormulaDetail(id);
	}
};

const medicalFormulaMutations = {
	createMedicalFormula: (
		root,
		{
			medicalFormula,
			manualMedications,
			manualProceduresLaboratories,
			medicalFormulaLaboratories,
			medicalFormulaMedicines,
			medicalFormulaProcedures,
			diagnosisDiseases
		},
		context
	) => {
		isAuthenticate(context);
		return medicalFormulaService.createMedicalFormula(
			medicalFormula,
			manualMedications,
			manualProceduresLaboratories,
			medicalFormulaLaboratories,
			medicalFormulaMedicines,
			medicalFormulaProcedures,
			diagnosisDiseases
		);
	}
};

export { medicalFormulaQueries, medicalFormulaMutations };
