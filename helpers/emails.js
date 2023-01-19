import nodemailer from 'nodemailer';

const enviarEmail = async (usuario) => {
    const { nombre, email, token } = usuario;

    const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    await transport.sendMail({
        from: '"Bienes Raices" <bienesraices@robles.com>',
        to: email,
        subject: 'Bienes Raices - Comprueba tu cuenta',
        text: "Comprueba tu cuenta en Bienes Raices'",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en Bienes Raices</p>
        <p>Tu cuenta ya esta casi lista, solo debes de comprobarla en el siguiente enlace:</p>
        
        <a href="${process.env.BACKEND_URL}/auth/confirmar/${token}">Confirmar Cuenta</a>
        
        <p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje</p>
        `,
    });
};

const emailOlvidePassword = async (usuario) => {
    const { nombre, email, token } = usuario;

    const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    await transport.sendMail({
        from: '"Bienes Raices" <bienesraices@robles.com>',
        to: email,
        subject: 'Bienes Raices - Reestablace tu Password',
        text: "Reestablace tu Password en Bienes Raices'",
        html: `<p>Hola: ${nombre} has solicitado reestablecer tu password en bienesRaices</p>
        <p>Sigue el siguiente enlace para generar un password nuevo: </p>
        
        <a href="${process.env.BACKEND_URL}/auth/olvide-password/${token}">Reestablecer Password</a>
        
        <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
        `,
    });
};
export { enviarEmail, emailOlvidePassword };
