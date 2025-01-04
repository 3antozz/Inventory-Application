const pool = require('./pool');

exports.getAllGenres = async () => {
    const { rows }  = await pool.query('SELECT * FROM genres;');
    return rows;
}

exports.getGenreGames = async (id) => {
    const { rows }  = await pool.query("SELECT games.id, games.name FROM games JOIN game_genre ON games.id=game_genre.game_id JOIN genres ON genre_id=genres.id WHERE genres.id=$1;", [id]);
    return rows;
}

exports.getGame = async (id) => {
    const { rows }  = await pool.query("SELECT games.name, games.description, TO_CHAR(games.release_date, 'DD-MM-YYYY') AS release_date, JSON_AGG(DISTINCT genres.name) AS genres, games.quantity, JSON_AGG(DISTINCT developers.name) AS developers FROM games LEFT JOIN game_genre ON games.id=game_genre.game_id LEFT JOIN genres ON genre_id=genres.id LEFT JOIN game_dev ON games.id=game_dev.game_id LEFT JOIN developers ON developer_id=developers.id GROUP BY games.id, games.name, games.release_date HAVING  games.id=$1;", [id]);
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

exports.insertGame = async (name, description, date, quantity, url, genresID, developersID) => {
    await pool.query("INSERT INTO games (name, description, release_date, quantity, cover_url) VALUES ($1, $2, $3, $4, $5);", [name, description, date, quantity, url]);
    genresID.forEach(async (id) => {
        await pool.query(
            "INSERT INTO game_genre (game_id, genre_id) VALUES ((SELECT id FROM games WHERE name=$1), $2);",
            [name, id]
        );
    });
    developersID.forEach(async (id) => {
        await pool.query(
            "INSERT INTO game_dev (game_id, developer_id) VALUES ((SELECT id FROM games WHERE name=$1), $2);",
            [name, id]
        );
    });
}

exports.getAllGames = async () => {
    const { rows } = await pool.query("SELECT * FROM games;")
    return rows;
}

exports.deleteGame = async (id) => {
    await Promise.all([
        pool.query("DELETE FROM games WHERE id=$1;", [id]),
        pool.query("DELETE FROM game_genre WHERE game_id=$1;", [id]),
        pool.query("DELETE FROM game_dev WHERE game_id=$1;", [id]),
    ]);
}

exports.getAllDevelopers = async () => {
    const { rows }  = await pool.query('SELECT * FROM developers;');
    return rows;
}