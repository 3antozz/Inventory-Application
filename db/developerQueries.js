const pool = require('./pool');



exports.getAllDevelopers = async () => {
    const { rows }  = await pool.query('SELECT * FROM developers;');
    return rows;
}

exports.insertDev = async (name, date) => {
    await pool.query("INSERT INTO developers (name, founded_date) VALUES ($1, $2);", [name, date]);
}

exports.getDev = async (id) => {
    const { rows } = await pool.query("SELECT * FROM developers WHERE id=$1;", [id]);
    return rows;
}

exports.updateDev = async (id, name, year) => {
    await pool.query("UPDATE developers SET name=$1, founded_date=$2 WHERE id=$3;", [name, year, id]);
}

exports.emptyDev = async (id) => {
    await pool.query("DELETE FROM game_dev WHERE developer_id=$1;", [id]);
}