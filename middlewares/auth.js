const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const validarToken = ( req, res, next) => {
    const token = request.headers.authorization;
    if (!token){
        responde.status(401).json({mensaje:'falta el Token'})
    }
    console.log(token)
}

module.exports = {
    validarToken
};