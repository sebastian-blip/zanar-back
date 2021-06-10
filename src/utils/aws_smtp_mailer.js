import { smtp as SmtpConfig } from '../config';
import nodemailer from 'nodemailer';

export class AwsSMTPMailer {
	constructor() {
		this.transportParams = {
			host: SmtpConfig.HOST,
			port: SmtpConfig.PORT,
			secure: false,
			auth: {
				user: SmtpConfig.USERNAME,
				pass: SmtpConfig.PASSWORD
			}
		};
	}

	async createTransport() {
		return await nodemailer.createTransport(this.transportParams);
	}

	async createMailData(mailData) {
		return {
			...mailData,
			from: mailData.from || SmtpConfig.SOURCE
		};
	}

	async send(mailOptions) {
		const transporter = await this.createTransport();
		return await transporter.sendMail(await this.createMailData(mailOptions));
	}
}

export default new AwsSMTPMailer();
