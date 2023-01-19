import Categorias from './Categorias.js';
import Precio from './Precio.js';
import Propiedad from './Propiedad.js';
import Usuario from './Usuario.js';

//asocioon 1:1 con hasOne- se lee de derecha a izquierda
//Precio.hasOne(Propiedad);

//asocioon 1:1 con belongsTo- se lee mas natatural
Propiedad.belongsTo(Precio, { foreignKey: 'precioId' });

//asociacion 1:N con hasMany - se lee natutal tambien
Usuario.hasMany(Propiedad, { foreignKey: 'usuarioId' });
Categorias.hasMany(Propiedad, { foreignKey: 'categoriaId' });

//asociacion N:N con belongsToMany- se lee natural tambien

export { Categorias, Precio, Propiedad, Usuario };
