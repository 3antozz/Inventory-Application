const pool = require('./pool');

exports.getAllGenres = async () => {
    const { rows }  = await pool.query('SELECT * FROM genres;');
    return rows;
}


exports.getGenre = async (id) => {
    const { rows } = await pool.query("SELECT * FROM genres WHERE id=$1", [id]);
    return rows;
}

exports.insertGenre = async (name, url) => {
    await pool.query("INSERT INTO genres (name, cover_url) VALUES ($1, $2);", [name, url]);
}

exports.emptyGenre = async (id) => {
    await pool.query("DELETE FROM game_genre WHERE genre_id=$1;", [id]);
}

exports.updateGenre = async (id, name, url) => {
    await pool.query("UPDATE genres SET name=$2, cover_url=$3 WHERE id=$1;", [id, name, url])
}

