import {} from 'dotenv/config';

import pkgDir from 'pkg-dir';
import database from './database';
import erp from './erp';
import smtp from './smtp';
import s3 from './s3';

export const general = {
	APP_FOLDER: pkgDir.sync(),
	UPLOAD_FOLDER: process.env.UPLOAD_FOLDER || 'uploads'
};

export { database };
export { erp };
export { smtp };
export { s3 };

export default {
	general,
	database,
	erp,
	smtp,
	s3
};
