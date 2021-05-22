import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class MedicalFormulaMedicines extends ResourceDao {
	constructor() {
		super(Models.MedicalFormulaMedicines, 'MedicalFormulaMedicines');
	}
}

const medicalFormulaMedicinesDao = new MedicalFormulaMedicines();

export { medicalFormulaMedicinesDao };
