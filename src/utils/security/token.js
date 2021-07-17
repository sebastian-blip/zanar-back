import {} from 'dotenv/config';
import jwt from 'jsonwebtoken';

const APP_SECRET_KEY = JSON.parse(`"${process.env.APP_SECRET_KEY}"`);
const APP_REFRESH_TOKEN_SECRET_KEY = JSON.parse(`"${process.env.APP_REFRESH_TOKEN_SECRET_KEY}"`);

const OPTIONS = {
	expiresIn: '3h'
};
/**
 * @Description: Verify if the Token is valid
 * @param {String} token
 */
const verifyToken = (token, refresh = false) =>
	jwt.verify(token, refresh ? APP_REFRESH_TOKEN_SECRET_KEY : APP_SECRET_KEY, OPTIONS);

/**
 * @Description: generate a Token
 */
const generateToken = (payload, refresh = false) =>
	jwt.sign(payload, refresh ? APP_REFRESH_TOKEN_SECRET_KEY : APP_SECRET_KEY, OPTIONS);

export { verifyToken, generateToken };
