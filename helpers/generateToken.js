import jwt from "jsonwebtoken";

import 'dotenv/config';

const secretKey = process.env.JWT_SECRET_KEY;


export const generateToken = (id, email) => {
    return jwt.sign({ id, email }, secretKey, {
        expiresIn: '1d'
    })
}