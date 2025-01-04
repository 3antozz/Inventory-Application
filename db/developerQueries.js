const pool = require('./pool');



exports.getAllDevelopers = async () => {
    const { rows }  = await pool.query('SELECT * FROM developers;');
    return rows;
}