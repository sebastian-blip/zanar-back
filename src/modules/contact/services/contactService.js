import resourceDao from '../../../database/mySql/resourceDao/resourceDao';
import Models from '../../../database/mySql';

class ContactService extends resourceDao {
	constructor() {
		super(Models.Contact, 'contact');
	}
}

const contactService = new ContactService();

export { contactService };
export { ContactService };
export default ContactService;
