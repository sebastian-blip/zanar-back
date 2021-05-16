import { sequelize as Connection } from '../../../database/mySql';
import { manualMedicationsDao } from '../daos/manualMedicationsDao';
import { manualProcedureLaboratoryDao } from '../daos/manualProcedureLaboratoryDao';
import { medicalFormulaDao } from '../daos/medicalFormulaDao';
import { medicalFormulaLaboratoryDao } from '../daos/medicalFormulaLaboratoryDao';
import { medicalFormulaMedicinesDao } from '../daos/medicalFormulaMedicinesDao';
import { medicalFormulaProceduresDao } from '../daos/medicalFormulaProceduresDao';

const createMedicalFormula = async (
	medicalFormula,
	manualMedications,
	manualProcedureLaboratory,
	medicalFormulaLaboratory,
	medicalFormulaMedicines,
	medicalFormulaProcedures
) => {
	const transaction = { transaction: await Connection.transaction() };
	if (
		!manualMedications &&
		!manualProcedureLaboratory &&
		!medicalFormulaLaboratory &&
		!medicalFormulaMedicines &&
		!medicalFormulaProcedures
	)
		throw new Error('Insufficient information');

	try {
		const { id } = await medicalFormulaDao.create(medicalFormula, transaction);
		if (manualMedications)
			await manualMedicationsDao.create({ ...manualMedications, formula_id: id }, transaction);
		if (manualProcedureLaboratory)
			await manualProcedureLaboratoryDao.create(
				{ ...manualProcedureLaboratory, formula_id: id },
				transaction
			);
		if (medicalFormulaLaboratory)
			await medicalFormulaLaboratoryDao.create(
				{ ...medicalFormulaLaboratory, formula_id: id },
				transaction
			);
		if (medicalFormulaMedicines)
			await medicalFormulaMedicinesDao.create(
				{ ...medicalFormulaMedicines, formula_id: id },
				transaction
			);
		if (medicalFormulaProcedures)
			await medicalFormulaProceduresDao.create(
				{ ...medicalFormulaProcedures, formula_id: id },
				transaction
			);
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

const getMedicalFormula = (patientId, doctorId, pagination) => {
	const filter = {};
	if (patientId) {
		filter.patient_id = patientId;
	} else if (doctorId) {
		filter.doctor_id = doctorId;
	}
	return medicalFormulaDao.getAll(filter, pagination);
};

const getMedicalFormulaDetail = (patientId, doctorId, pagination) => {
	const filter = {};
	if (patientId) {
		filter.patient_id = patientId;
	} else if (doctorId) {
		filter.doctor_id = doctorId;
	}
	return medicalFormulaDao.getAll(filter, pagination);
};

export { createMedicalFormula, getMedicalFormula, getMedicalFormulaDetail };
