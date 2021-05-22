import { diseaseDao } from '../dao/diseaseDao';

const getDiseases = (filter, pagination) => diseaseDao.getAll(filter, pagination);

// eslint-disable-next-line import/prefer-default-export
export { getDiseases };
