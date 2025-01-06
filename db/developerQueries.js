const pool = require('./pool');



exports.getAllDevelopers = async () => {
    const { rows }  = await pool.query('SELECT * FROM developers;');
    return rows;
}

exports.insertDev = async (name, logo, date) => {
    await pool.query("INSERT INTO developers (name, founded_date, logo_url) VALUES ($1, $2, $3);", [name, date, logo]);
}

exports.getDev = async (id) => {
    const { rows } = await pool.query("SELECT * FROM developers WHERE id=$1;", [id]);
    return rows;
}

exports.updateDev = async (id, name, logo, year) => {
    await pool.query("UPDATE developers SET name=$1, founded_date=$2, logo_url=$4 WHERE id=$3;", [name, year, id, logo]);
}

exports.removeDev = async (id) => {
    await pool.query("DELETE FROM developers WHERE id=$1;", [id]);
}