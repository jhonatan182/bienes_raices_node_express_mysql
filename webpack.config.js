import path from 'path';

export default {
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
    },
    output: {
        /* la llave del entry se pasa al name del output  */
        filename: '[name].js',
        /* tiene que ser una ruta absoluta */
        path: path.resolve('public/js'),
    },
};
