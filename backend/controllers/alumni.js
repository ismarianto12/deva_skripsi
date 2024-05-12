import jwt from 'jsonwebtoken'
import db from '../db/database';

export const Getalumni = async (req, res) => {
    try {
        const { QueryTypes } = require('sequelize');
        const users = await db.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });
        res.json({
            data: users[0]
        })
    } catch {
        res.json({
            data: null
        }, 400)
    }
}
