import jwt from 'jsonwebtoken';

const generarJWT = ({ id, nombre }) =>
    jwt.sign({ id, nombre }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

export default generarJWT;
