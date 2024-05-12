import { Sequelize } from "sequelize";
const db = new Sequelize('unindra_skripsi', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3308'
})

export default db;