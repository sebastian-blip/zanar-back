import { nanoid } from 'nanoid';
import { createReadStream, createWriteStream, mkdirSync, existsSync, unlinkSync } from 'fs';
import { general as Config } from '../config/index';

export class FileManager {
	constructor(mainFolder) {
		this.mainFolder = mainFolder;
		this.path = `${Config.APP_FOLDER}/${Config.UPLOAD_FOLDER}/${this.mainFolder}`;
		this.initDisk();
	}

	initDisk() {
		if (!existsSync(this.path)) mkdirSync(this.path, { recursive: true });
	}

	async put(file) {
		await this.initDisk();

		const uuid = nanoid();
		const newFileName = `${uuid}${file.filename || ''}`;
		const filePath = `${this.path}/${newFileName}`;

		return new Promise((resolve, reject) => {
			file.stream
				.pipe(createWriteStream(filePath))
				.on('finish', () =>
					resolve({
						path: filePath,
						fileName: newFileName,
						originalFileName: file.filename,
						mimetype: file.mimetype
					})
				)
				.on('error', reject);
		});
	}

	async get(filename) {
		await this.initDisk();

		const filePath = `${this.path}/${filename}`;

		if (!existsSync(filePath)) throw new Error(`File ${filename} not found`);

		return createReadStream(filePath);
	}

	async delete(filename) {
		const filePath = `${this.path}/${filename}`;
		if (existsSync(filePath)) {
			unlinkSync(filePath);
			return true;
		}
		else{
			return false;
		}
	}
}
