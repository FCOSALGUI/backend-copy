import { Sequelize } from "sequelize";

const sequelize = new Sequelize('caritasdb', 'caritasdb', 'Nv2m5~DI4B!6', {
    host: 'den1.mssql8.gear.host',
    dialect: 'mssql',
    dialectOptions: {
        encrypt: true,
        trustServerCertificate:true
    }
});

export default sequelize;