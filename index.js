import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import db from './config/db.js';
//rutas
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';

//Crear la app
const app = express();

// conexion a la base de datos
try {
    await db.authenticate();
    db.sync();
    console.log('Conexión Correcta a la base de datos');
} catch (error) {
    console.log(error);
}

// permiter que se reciban datos en el req.body
app.use(express.urlencoded({ extended: true }));

// habilitar cookie-parser porque lo requiere csurf
app.use(cookieParser());

// habilitar CSRF almacenarlo y pasarlo a la route
const csrfProteccion = csurf({ cookie: true });

// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views'); // donde estan las vistas que va renderizar

//Carpeta Publica
app.use(express.static('public'));

//Routing
app.use('/auth', csrfProteccion, usuarioRoutes);
app.use('/', csrfProteccion, propiedadesRoutes);

// defiendo el el puerto del servidor
const port = process.env.PORT || 3000;

//arrancando el server
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
