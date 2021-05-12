import {} from 'dotenv/config';
import jwt from 'jsonwebtoken';

const APP_SECRET_KEY = JSON.parse(`"${process.env.APP_SECRET_KEY}"`);
const OPTIONS = {
	expiresIn: '3h'
};
/**
 * @Description: Verify if the Token is valid
 * @param {String} token
 */
const verifyToken = token => jwt.verify(token, APP_SECRET_KEY, OPTIONS);

/**
 * @Description: generate a Token
 */
const generateToken = payload => jwt.sign(payload, APP_SECRET_KEY, OPTIONS);

export { verifyToken, generateToken };
