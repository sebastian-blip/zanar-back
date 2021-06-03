import {} from 'dotenv/config';

import pkgDir from 'pkg-dir';
import database from './database';
import erp from './erp';
import smtp from './smtp';

export const general = {
	APP_FOLDER: pkgDir.sync()
};

export { database };
export { erp };
export { smtp };

export default {
	general,
	database,
	erp,
	smtp
};
