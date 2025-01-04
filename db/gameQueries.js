const pool = require('./pool');

exports.getGenreGames = async (id) => {
    const { rows }  = await pool.query("SELECT games.id, games.name FROM games JOIN game_genre ON games.id=game_genre.game_id JOIN genres ON genre_id=genres.id WHERE genres.id=$1;", [id]);
    return rows;
}

exports.getGame = async (id) => {
    const { rows }  = await pool.query("SELECT games.id AS id, games.name, games.description, TO_CHAR(games.release_date, 'YYYY-MM-DD') AS release_date, JSON_AGG(DISTINCT genres.name) AS genres, games.quantity, JSON_AGG(DISTINCT developers.name) AS developers FROM games LEFT JOIN game_genre ON games.id=game_genre.game_id LEFT JOIN genres ON genre_id=genres.id LEFT JOIN game_dev ON games.id=game_dev.game_id LEFT JOIN developers ON developer_id=developers.id GROUP BY games.id, games.name, games.release_date HAVING  games.id=$1;", [id]);
    return rows;
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

exports.updateGame = async (id, name, description, date, quantity, url, genresID, developersID) => {
    await Promise.all([pool.query("UPDATE games SET name=$1, description=$2, release_date=$3, quantity=$4, cover_url=$5 WHERE id=$6;", [name, description, date, quantity, url, id]),
    pool.query("DELETE FROM game_genre WHERE game_id=$1;", [id]),
    pool.query("DELETE FROM game_dev WHERE game_id=$1;", [id])])
    await Promise.all([genresID.forEach(async (genreID) => {
        await pool.query(
            "INSERT INTO game_genre (game_id, genre_id) VALUES ($1, $2);",
            [id, genreID]
        );
    }),
    developersID.forEach(async (devID) => {
        await pool.query(
            "INSERT INTO game_dev (game_id, developer_id) VALUES ($1, $2);",
            [id, devID]
        );
    })])
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