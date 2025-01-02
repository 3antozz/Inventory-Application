const pool = require('./pool');

exports.getAllGenres = async () => {
    const { rows }  = await pool.query('SELECT ARRAY_AGG(name) AS genres FROM genres;');
    return rows;
}

exports.getGenreGames = async (genre) => {
    const { rows }  = await pool.query("SELECT games.id, games.name FROM games JOIN game_genre ON games.id=game_genre.game_id JOIN genres ON genre_id=genres.id WHERE genres.name=$1;", [genre]);
    return rows;
}

exports.getGame = async (id) => {
    const { rows }  = await pool.query("SELECT games.name, games.description, TO_CHAR(games.release_date, 'DD-MM-YYYY') AS release_date, ARRAY_AGG(DISTINCT genres.name) AS genres, ARRAY_AGG(DISTINCT developers.name) AS developers FROM games JOIN game_genre ON games.id=game_genre.game_id JOIN genres ON genre_id=genres.id JOIN game_dev ON games.id=game_dev.game_id JOIN developers ON developer_id=developers.id GROUP BY games.id, games.name, games.release_date HAVING  games.id=$1;", [id]);
    return rows;
}