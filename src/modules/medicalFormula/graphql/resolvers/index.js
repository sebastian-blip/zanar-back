import * as medicalFormulaService from '../../services/medicalFormulaService';

const medicalFormulaQueries = {
	getMedicalFormulas: (root, { filter, pagination, orderBy, sortBy }) => {
		return medicalFormulaService.getMedicalFormulas(filter, pagination, orderBy, sortBy);
	},
	getMedicalFormulaDetail: (root, { id }) => {
		return medicalFormulaService.getMedicalFormulaDetail(id);
	}
};

const diseasesMutations = {
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
		}
	) => {
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

export { medicalFormulaQueries, diseasesMutations };
