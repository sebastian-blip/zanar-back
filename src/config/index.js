import {} from 'dotenv/config';

import database from './database';
import erp from './erp';

export { database };
export { erp };

export default {
	database,
	erp
};
