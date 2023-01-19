import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// uso de variables de entorno
dotenv.config({ path: '.env' });

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS ?? '',
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        define: {
            timestamps: true,
        },
        pool: {
            max: 5 /* nuemero de conexioes por usuario */,
            min: 0 /* minimo de conexiones por usuario */,
            acquire: 30000 /* 30s antes de que un processo marque un error */,
            idle: 10000 /* 10s antes de que se cierre una conexios cuando no se usa */,
        },
        operatorAliases: false,
    }
);

export default db;
