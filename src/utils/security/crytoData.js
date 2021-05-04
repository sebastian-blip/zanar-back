/*
@Author: Daniel Reyes Betancourt
@Description: Methods for encryption and decryption Gana services
@Date: 23/10/2019
@Version: 1.0
*/
import { decrypt, encrypt } from './cryptoHandler';

/*
@Description: Encrypt the information of a user from an object
@Params: {obUser} Object to be encrypted
*/
const encryptUserData = (obUser, blAdmin) => {
	const obEncryptUser = obUser;
	let arrEncrypTap = ['ideUsuario', 'usuario'];
	if (blAdmin) {
		arrEncrypTap = ['email', 'password', 'id'];
	}
	try {
		if (process.env.GANA_USE_ENCRYPTION) {
			arrEncrypTap.forEach(key => {
				if (Object.prototype.hasOwnProperty.call(obEncryptUser, key)) {
					obEncryptUser[key] = encrypt(obEncryptUser[key]);
				}
			});
		}
		return obEncryptUser;
	} catch (error) {
		throw new Error('Error encrypting the user data');
	}
};

/*
@Description: Decrypt the information of a user from an object
@Params: {obUser} Object to be decrypted
*/
const decryptUserData = (obUser, blAdmin) => {
	const obDecryptUser = obUser;
	let arrDecrypTap = [
		'ideUsuario',
		'usuario',
		'clave',
		'claveActual',
		'claveNueva',
		'contrasena',
		'user'
	];
	if (blAdmin) {
		arrDecrypTap = ['email', 'password', 'id'];
	}
	try {
		if (process.env.GANA_USE_ENCRYPTION) {
			arrDecrypTap.forEach(key => {
				if (Object.prototype.hasOwnProperty.call(obDecryptUser, key)) {
					obDecryptUser[key] = decrypt(obDecryptUser[key]);
				}
			});
		}
		return obDecryptUser;
	} catch (error) {
		throw new Error('Error decrypting the user data');
	}
};

export { decryptUserData, encryptUserData };
