import * as typeDocumentService from '../../service/typeDocumentService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const typeDocumentQueries = {
	getDocumentsTypes: (root, values, context) => {
		isAuthenticate(context);
		return typeDocumentService.getDocumentsTypes();
	}
};

const typeDocumentMutations = {};

export { typeDocumentQueries, typeDocumentMutations };
