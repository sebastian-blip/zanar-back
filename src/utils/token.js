/*
@Author: Daniel Reyes Betancourt
@Description: Security using JWT with RS256 to generate and decrypt token.
@Date: 23/10/2019
@Version: 1.0
*/
import jwt from 'jsonwebtoken';
/**
 * @Description: Verify if the Token is valid
 * @param {String} sbToken
 */
const verifyToken = sbToken => {
	try {
		/* ====================   JWT Verify ===================== */
		const sbPublicKey = JSON.parse(`"${process.env.GANA_ADMIN_PUBLIC_KEY}"`);
		const obVerifyOptions = {
			algorithm: ['RS256'],
			expiresIn: '3h'
		};
		jwt.verify(sbToken, sbPublicKey, obVerifyOptions);
		return true;
	} catch (error) {
		throw new Error('No autorizado');
	}
};

/**
 * @Description: generate a Token
 */
const generateToken = async () => {
	try {
		/*
			====================   JWT Signing =====================
			If you want to generate a test token, GANA_ADMIN_SECURITY must be set as true.
		*/
		const sbPrivateKey = JSON.parse(`"${process.env.GANA_ADMIN_PRIVATE_KEY}"`);
		/* Payload */
		const obPayload = {
			application: 'Gana web'
		};
		const obSignOptions = {
			algorithm: 'RS256',
			expiresIn: '3h'
		};
		const sbToken = jwt.sign(obPayload, sbPrivateKey, obSignOptions);
		return sbToken;
	} catch (error) {
		throw new Error('Error: The token could not be generated.');
	}
};

export { verifyToken, generateToken };
