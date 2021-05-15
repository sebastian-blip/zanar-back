import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class ConsultingRoomsDao extends ResourceDao {
	constructor() {
		super(Models.ConsultingRooms, 'ConsultingRooms');
	}
}

const consultingRoomsDao = new ConsultingRoomsDao();

export { consultingRoomsDao };
