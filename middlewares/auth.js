const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const validarToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ msg: "Token no proporcionado" });
    }
    console.log(token);

    next();
}

module.exports = {validarToken};