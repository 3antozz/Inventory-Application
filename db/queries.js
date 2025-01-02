const pool = require('./pool');

exports.getAllGenres = async () => {
    const { rows }  = await pool.query('SELECT ARRAY_AGG(name) AS genres FROM genres;');
    return rows;
}

exports.getGenreGames = async (genre) => {
    const { rows }  = await pool.query("SELECT games.name FROM games JOIN game_genre ON games.id=game_genre.game_id JOIN genres ON genre_id=genres.id WHERE genres.name=$1;", [genre]);
    return rows;
}