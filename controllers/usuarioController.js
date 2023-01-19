import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { enviarEmail, emailOlvidePassword } from '../helpers/emails.js';
import { generarToken } from '../helpers/generarToken.js';
import Usuario from '../models/Usuario.js';
import generarJWT from '../helpers/generarJWT.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Inicia Sesión',
        csrfToken: req.csrfToken(),
    });
};

const autenticar = async (req, res) => {
    await check('email').isEmail().withMessage('Email obligatorio').run(req);
    await check('password')
        .notEmpty()
        .withMessage('El password es obligatorio')
        .run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Inicia Sesión',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        });
    }

    const { email, password } = req.body;
    try {
        //verificar el usuario exista
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.render('auth/login', {
                pagina: 'Inicia Sesión',
                errores: [
                    {
                        msg: 'El usuario no existe',
                    },
                ],
                csrfToken: req.csrfToken(),
            });
        }

        //comprobar que el usuario este confirmado
        if (!usuario.confirmado) {
            return res.render('auth/login', {
                pagina: 'Inicia Sesión',
                errores: [
                    {
                        msg: 'Esta cuenta no ha sido confirmada',
                    },
                ],
                csrfToken: req.csrfToken(),
            });
        }

        //comprobar que el password sea el correcto
        if (!usuario.comprobarPassword(password)) {
            return res.render('auth/login', {
                pagina: 'Inicia Sesión',
                errores: [
                    {
                        msg: 'El password es incorrecto',
                    },
                ],
                csrfToken: req.csrfToken(),
            });
        }

        //Autenticar el usuario
        const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

        //almacenando el cookie
        res.cookie('_token', token, {
            httpOnly: true,
            // secure: true,
            // sameSite: true
        }).redirect('/mis-propiedades');
    } catch (error) {
        console.log(error);
    }
};

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken(),
    });
};
const registrar = async (req, res) => {
    //? desestructuracion
    const { nombre, email, password } = req.body;

    //? validaciones
    await check('nombre')
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .run(req);

    await check('email').isEmail().withMessage('Email no válido').run(req);
    await check('password')
        .isLength({ min: 6 })
        .withMessage('El password debe de ser de al menos de 6 caracteres')
        .run(req);

    await check('repetir_password')
        .equals(password)
        .withMessage('Los password no son iguales')
        .run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            nombre,
            email,
            csrfToken: req.csrfToken(),
        });
    }

    // verificar que el usuario no este registrado

    try {
        const existeUsuario = await Usuario.findOne({
            where: { email },
        });
        if (existeUsuario) {
            return res.render('auth/registro', {
                pagina: 'Crear Cuenta',
                errores: [
                    {
                        msg: 'El usuario ya está registrado',
                    },
                ],
                nombre,
                email,
                csrfToken: req.csrfToken(),
            });
        }

        //almacenar un usuario
        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            token: generarToken(),
            confirmado: true,
        });

        // mostrar mensaje de confirmacion
        res.render('templates/mensaje', {
            pagina: 'Cuenta Creada Correctamente',
            mensaje:
                'Hemos enviado un Email de Confirmacion, presiona en el enlace',
        });

        enviarEmail({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token,
        });
    } catch (error) {
        console.log(error);
    }
};
// funcion que comprueba una cuenta
const confirmar = async (req, res) => {
    const { token } = req.params;

    //verificar si el token es valido
    try {
        const usuario = await Usuario.findOne({ where: { token } });
        if (!usuario) {
            return res.render('auth/confirmar-cuenta', {
                pagina: 'Error al confirmar tu cuenta',
                mensaje:
                    'Hubo un error al confirmar tu cuenta, intenta de nuevo',
                error: true,
            });
        }

        //confirmar cuenta
        usuario.token = null;
        usuario.confirmado = true;

        await usuario.save();
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Cuenta Confirmada',
            mensaje: 'La cuenta se confirmó correctamente',
            error: false,
        });
    } catch (error) {
        console.log(error);
    }
};

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: req.csrfToken(),
    });
};

const resetPassword = async (req, res) => {
    //validaciones
    await check('email').isEmail().withMessage('Email no Válido').run(req);
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        });
    }

    // buscar el usuario
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Usuario no encontrado' }],
        });
    }

    // generar un token un generar el email
    usuario.token = generarToken();
    await usuario.save();

    // enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token,
    });
    // renderizar un mensaje
    res.render('templates/mensaje', {
        pagina: 'Restablecer tu Password',
        mensaje: 'Hemos enviado un Email con las instrucciones',
    });
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu passoword',
            mensaje:
                'Hubo un error al validar tu informacion, intenta de nuevo',
            error: true,
        });
    }

    //mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Reestablece tu Password',
        csrfToken: req.csrfToken(),
    });
};
const nuevoPassword = async (req, res) => {
    // validar el password
    await check('password')
        .isLength({ min: 6 })
        .withMessage('El password debe de ser de al menos de 6 caracteres')
        .run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        res.render('auth/reset-password', {
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        });
    }

    const { token } = req.params;
    const { password } = req.body;
    //identificar quien hace el cambio
    const usuario = await Usuario.findOne({ where: { token } });

    //hashear el nuevo passowrd
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password Reestablecido',
        mensaje: 'El password se guardó correctamente',
    });
};

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword,
};
