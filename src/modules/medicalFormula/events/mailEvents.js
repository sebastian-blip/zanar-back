import moment from 'moment';
import { general as Config } from '../../../config';
import Mailer from '../../../utils/aws_smtp_mailer';
import { TemplateManager } from '../../../utils/template_manager';
import { medicalFormulaDao } from '../daos/medicalFormulaDao';
import { doctorService } from '../../doctor/services/doctorService'
import { patientService } from '../../patient/services/patientService'

export class MailEvents {
	static async medicalFormulaCreated(medicalFormulaId) {
		const medicalFormula = await medicalFormulaDao.get(medicalFormulaId);
		const doctor = await doctorService.get(medicalFormula.Doctor.id, { includeAdditionalFields: true });
		const patient = await patientService.get(medicalFormula.Patient.id, { includeAdditionalFields: true });

		const template = new TemplateManager(
			`${Config.APP_FOLDER}/src/resources/templates/medical_formula_v3.html`
		);
		const data = medicalFormula.toJSON();

		data.Doctor = doctor;
		data.Patient = patient;
		data.createdAt = moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss');
		data.hasDiagnosisDiseases = data.DiagnosisDiseases.length > 0;

		data.Medicines = [...data.ManualMedications, ...data.MedicalFormulaMedicines];
		data.hasMedicines = data.Medicines.length > 0;

		data.Laboratories = [
			...data.ManualProcedureLaboratories.filter(mpl => mpl.type === 'LABORATORY'),
			...data.MedicalFormulaLaboratories
		];
		data.hasLaboratories = data.Laboratories.length > 0;

		data.Procedures = [
			...data.ManualProcedureLaboratories.filter(mpl => mpl.type === 'PROCEDURE'),
			...data.MedicalFormulaProcedures
		];
		data.hasProcedures = data.Procedures.length > 0;

		data.current_year = moment().format('yyyy');

		const mailOptions = {
			to: medicalFormula.Patient.email,
			subject: 'Nueva fórmula médica',
			html: template.render(data)
		};

		await Mailer.send(mailOptions);
	}
}

export default MailEvents;
