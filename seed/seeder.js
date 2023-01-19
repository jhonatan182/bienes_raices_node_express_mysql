import { exit, argv } from 'node:process';
import { Precio, Categorias } from '../models/index.js';
import seedCategorias from './categorias.js';
import seedPrecios from './precios.js';
import db from '../config/db.js';

const importarDatos = async () => {
    try {
        //verificar la conexion a la base de datos
        await db.authenticate();
        //construir las tablas que falten
        await db.sync();
        //insetar los datos

        await Promise.all([
            Categorias.bulkCreate(seedCategorias),
            Precio.bulkCreate(seedPrecios),
        ]);
        exit(0); // todo termino sin errores
    } catch (error) {
        console.log(error);
        exit(1); // el 1 indica que todo termino pero son errores
        // throw new Error(error);
    }
};

const eliminarDatos = async () => {
    try {
        // await Promise.all([
        //     Categorias.destroy({ where: {}, truncate: true }),
        //     Precio.destroy({ where: {}, truncate: true }),
        // ]);

        //* en una sola linea

        await db.sync({ force: true });

        exit();
    } catch (error) {
        console.log(error);
        exit(1); // el 1 indica que todo termino pero son errores
        // throw new Error(error);
    }
};

// recoge los arguemntos de un comando que apunta a este archivo
if (argv[2] === '-i') {
    importarDatos();
} else if (argv[2] === '-e') {
    eliminarDatos();
}
