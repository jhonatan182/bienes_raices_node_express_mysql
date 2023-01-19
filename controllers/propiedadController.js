import Categorias from '../models/Categorias.js';
import Precio from '../models/Precio.js';

const admin = async (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
        barra: true,
    });
};

// Formulario para crear un nueva propiedad
const crear = async (req, res) => {
    //consultasr la base de dato y obtener las categorias y precios
    try {
        const [categorias, precios] = await Promise.all([
            Categorias.findAll(),
            Precio.findAll(),
        ]);

        res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            barra: true,
            precios,
            categorias,
        });
    } catch (error) {
        res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            barra: true,
            error: true,
        });
        console.log(error);
        //throw new Error('Ocurrio un error');
    }
};

export { admin, crear };
