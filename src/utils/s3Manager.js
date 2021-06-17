import { s3 } from '../config';
import { exec } from 'child_process';

export class S3Manager {
	constructor() {
		this.bucket = s3.BUCKET;
	}

    getBucketName(){
        return this.bucket;
    }

	async executeCommand(command) {
		return new Promise((resolve, reject) => {
			exec(command, (error, stdout, stderr) => {
				if (error) {
					reject(error);
                    return;
				}
				if (stderr) {
					reject(new Error(stderr));
                    return;
				}
				resolve(stdout);
			});
		});
	}

	async move(filePath, s3FilePath) {
		if(!s3.BUCKET) return false;
        return await this.executeCommand(`aws s3 mv ${filePath} s3://${this.bucket}/${s3FilePath}`);
    }

	async delete(s3FilePath) {
		if(!s3.BUCKET) return false;
        return await this.executeCommand(`aws s3 rm s3://${this.bucket}/${s3FilePath} --recursive`)
    }
}
