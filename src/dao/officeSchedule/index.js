import { sequelize } from '../../database/mySql';

// eslint-disable-next-line camelcase
const { office_schedules } = sequelize.models;

// eslint-disable-next-line camelcase
const getOfficeSchedulesByConsultingRoom = consulting_rooms_id => {
	return office_schedules.findAll({ where: { consulting_rooms_id } });
};

const create = async officeScheduleData => {
	const record = await office_schedules.create(officeScheduleData);
	return record.id;
};

const update = (id, officeScheduleData) => {
	return office_schedules.update(officeScheduleData, { where: { id } });
};

const deleteRow = id => {
	return office_schedules.destroy({ where: { id } });
};

export { getOfficeSchedulesByConsultingRoom, create, update, deleteRow };
