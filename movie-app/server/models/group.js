import pool from '../helpers/db.js';

class Group {
    static async create({ name, description, ownerId }) {
        const insertGroupQuery = `
            INSERT INTO Groups (group_id, name, description, owner_id)
            VALUES (DEFAULT, $1, $2, $3)
            RETURNING *;
        `;
        const result = await pool.query(insertGroupQuery, [name, description, ownerId]);
        return result.rows[0];
    }
}

export default Group;
