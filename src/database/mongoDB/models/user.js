import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	id: String,
	firstname: String,
	secondname: String,
	gender: String,
	birthday: String
});

export default mongoose.model('user', userSchema);
