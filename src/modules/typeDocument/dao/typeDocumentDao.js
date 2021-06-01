import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class TypeDocumentDao extends ResourceDao {
	constructor() {
		super(Models.TypeDocument, 'TypeDocument');
	}
}

const typeDocumentDao = new TypeDocumentDao();

export { typeDocumentDao };
