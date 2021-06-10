const smtp = {
	SOURCE: process.env.SMTP_SOURCE || 'no-reply@zanarplus.com',
	USERNAME: process.env.SMTP_USERNAME,
	PASSWORD: process.env.SMTP_PASSWORD,
	HOST: process.env.SMTP_HOST,
	PORT: process.env.SMTP_PORT || 587
};

export default smtp;
