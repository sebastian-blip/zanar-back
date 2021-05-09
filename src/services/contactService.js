import { ApolloError } from 'apollo-server-errors';
import ResourceService from './resourceService';
import Models, { sequelize as Connection } from '../database/mySql';

class ContactService extends ResourceService {
    constructor() {
        super(Models.Contact, 'contact');
    }
}

const contactService = new ContactService;

export { contactService }
export { ContactService };
export default ContactService;