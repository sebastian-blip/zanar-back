/*
@Author: Daniel Reyes Betancourt
@Description: Methods to encrypt and decrypt information
@Date: 26/06/2019
@Version: 1.0
*/
import crypto from 'crypto-js';

/*
@Description: Encrypt a text in AES format
@Params: {sbText} Text to be Encrypted
*/
const encrypt = sbText => {
	try {
		const sbEncryptText = crypto.AES.encrypt(
			sbText.toString(),
			process.env.GANA_ENCRYPTION_KEY.toString()
		).toString();
		return sbEncryptText;
	} catch (error) {
		throw new Error('Error encrypting data');
	}
};
/*
@Description: Decrypt a text in AES format
@Params: {sbCiphertext} Encrypted text 
*/
const decrypt = sbCiphertext => {
	try {
		const sbDecriptText = crypto.AES.decrypt(
			sbCiphertext.toString(),
			process.env.GANA_ENCRYPTION_KEY.toString()
		).toString(crypto.enc.Utf8);
		return sbDecriptText;
	} catch (error) {
		throw new Error('Error decrypting data');
	}
};

export { encrypt, decrypt };
