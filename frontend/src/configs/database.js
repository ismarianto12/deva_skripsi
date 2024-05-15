import { Sequelize } from "sequelize";

const db = new Sequelize('unindra_skripsi', 'root', '', {
  host: 'localhost',
  port: '3308',
  dialect: 'mysql'
});

export default db;
