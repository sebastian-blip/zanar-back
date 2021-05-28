import { typeDocumentDao } from '../dao/typeDocumentDao';

const getDocumentsTypes = async () => {
	const result = await typeDocumentDao.getAll();
	return result.records;
};

// eslint-disable-next-line import/prefer-default-export
export { getDocumentsTypes };
