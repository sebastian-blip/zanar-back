import { sequelize as Connection } from '../../../database/mySql';
import { manualMedicationsDao } from '../daos/manualMedicationsDao';
import { manualProcedureLaboratoryDao } from '../daos/manualProcedureLaboratoryDao';
import { medicalFormulaDao } from '../daos/medicalFormulaDao';
import { medicalFormulaLaboratoryDao } from '../daos/medicalFormulaLaboratoryDao';
import { medicalFormulaMedicinesDao } from '../daos/medicalFormulaMedicinesDao';
import { medicalFormulaProceduresDao } from '../daos/medicalFormulaProceduresDao';
import { diagnosisDiseasesDao } from '../daos/diagnosisDiseases';

const createMedicalFormula = async (
	medicalFormula,
	manualMedications = [],
	manualProceduresLaboratories = [],
	medicalFormulaLaboratories = [],
	medicalFormulaMedicines = [],
	medicalFormulaProcedures = [],
	diagnosisDiseases = []
) => {
	const transaction = { transaction: await Connection.transaction() };
	if (
		!manualMedications.length === 0 &&
		!manualProceduresLaboratories.length === 0 &&
		!medicalFormulaLaboratories.length === 0 &&
		!medicalFormulaMedicines.length === 0 &&
		!medicalFormulaProcedures.length === 0
	)
		throw new Error('Insufficient information');

	try {
		// eslint-disable-next-line camelcase
		const { id: formula_id } = await medicalFormulaDao.create(medicalFormula, transaction);
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < manualMedications.length; i++) {
			const manualMedication = manualMedications[i];
			// eslint-disable-next-line no-await-in-loop
			await manualMedicationsDao.create({ ...manualMedication, formula_id }, transaction);
		}
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < manualProceduresLaboratories.length; i++) {
			const manualProcedureLaboratory = manualProceduresLaboratories[i];
			// eslint-disable-next-line no-await-in-loop
			await manualProcedureLaboratoryDao.create(
				{ ...manualProcedureLaboratory, formula_id },
				transaction
			);
		}
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < medicalFormulaLaboratories.length; i++) {
			const medicalFormulaLaboratory = medicalFormulaLaboratories[i];
			// eslint-disable-next-line no-await-in-loop
			await medicalFormulaLaboratoryDao.create(
				{ ...medicalFormulaLaboratory, formula_id },
				transaction
			);
		}
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < medicalFormulaMedicines.length; i++) {
			const medicalFormulaMedicine = medicalFormulaMedicines[i];
			// eslint-disable-next-line no-await-in-loop
			await medicalFormulaMedicinesDao.create(
				{ ...medicalFormulaMedicine, formula_id },
				transaction
			);
		}
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < medicalFormulaProcedures.length; i++) {
			const medicalFormulaProcedure = medicalFormulaProcedures[i];
			// eslint-disable-next-line no-await-in-loop
			await medicalFormulaProceduresDao.create(
				{ ...medicalFormulaProcedure, formula_id },
				transaction
			);
		}
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < diagnosisDiseases.length; i++) {
			// eslint-disable-next-line camelcase
			const disease_id = diagnosisDiseases[i];
			// eslint-disable-next-line no-await-in-loop
			await diagnosisDiseasesDao.create({ disease_id, formula_id }, transaction);
		}

		// The notification procedure is missing

		await transaction.transaction.commit();
		// eslint-disable-next-line camelcase
		return formula_id;
	} catch (error) {
		await transaction.transaction.rollback();
		throw error;
	}
};

const getMedicalFormulas = (filter, pagination, orderBy, sortBy) => {
	return medicalFormulaDao.getMedicalFormulaList(filter, pagination, orderBy, sortBy);
};

const getMedicalFormulaDetail = id => {
	return medicalFormulaDao.get(id);
};

export { createMedicalFormula, getMedicalFormulas, getMedicalFormulaDetail };
