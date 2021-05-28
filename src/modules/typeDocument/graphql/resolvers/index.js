import * as typeDocumentService from '../../service/typeDocumentService';

const typeDocumentQueries = {
	getDocumentsTypes: () => typeDocumentService.getDocumentsTypes()
};

const typeDocumentMutations = {};

export { typeDocumentQueries, typeDocumentMutations };
