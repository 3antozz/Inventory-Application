const pool = require('./pool');

exports.getGenreGames = async (id) => {
    const { rows }  = await pool.query("SELECT games.id AS id, games.cover_url, games.name, games.description, TO_CHAR(games.release_date, 'YYYY-MM-DD') AS release_date, JSON_AGG(DISTINCT genres.name) AS genres, games.price, games.quantity, JSON_AGG(DISTINCT developers.name) AS developers FROM games LEFT JOIN game_genre ON games.id=game_genre.game_id LEFT JOIN genres ON genre_id=genres.id LEFT JOIN game_dev ON games.id=game_dev.game_id LEFT JOIN developers ON developer_id=developers.id GROUP BY genres.id, games.id, games.name, games.release_date HAVING genres.id=$1 ORDER BY games.name;", [id]);
    return rows;
}

exports.getDevGames = async (id) => {
    const { rows }  = await pool.query("SELECT games.id AS id, games.cover_url, games.name, games.description, TO_CHAR(games.release_date, 'YYYY-MM-DD') AS release_date, JSON_AGG(DISTINCT genres.name) AS genres, games.price, games.quantity, JSON_AGG(DISTINCT developers.name) AS developers FROM games LEFT JOIN game_genre ON games.id=game_genre.game_id LEFT JOIN genres ON genre_id=genres.id LEFT JOIN game_dev ON games.id=game_dev.game_id LEFT JOIN developers ON developer_id=developers.id GROUP BY developers.id, games.id, games.name, games.release_date HAVING developers.id=$1 ORDER BY games.name;", [id]);
    return rows;
}

exports.getGame = async (id) => {
    const { rows }  = await pool.query("SELECT games.id AS id, games.cover_url, games.name, games.description, TO_CHAR(games.release_date, 'YYYY-MM-DD') AS release_date, JSON_AGG(DISTINCT genres.name) AS genres, games.price, games.quantity, JSON_AGG(DISTINCT developers.name) AS developers FROM games LEFT JOIN game_genre ON games.id=game_genre.game_id LEFT JOIN genres ON genre_id=genres.id LEFT JOIN game_dev ON games.id=game_dev.game_id LEFT JOIN developers ON developer_id=developers.id GROUP BY games.id, games.name, games.release_date HAVING  games.id=$1;", [id]);
    return rows;
}

exports.insertGame = async (name, description, date, price, quantity, url, genresID, developersID) => {
    const { rows } = await pool.query("INSERT INTO games (name, description, release_date, price, quantity, cover_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;", [name, description, date, price, quantity, url]);
    genresID.forEach(async (id) => {
        await pool.query(
            "INSERT INTO game_genre (game_id, genre_id) VALUES ($1, $2);",
            [rows[0].id, id]
        );
    });
    developersID.forEach(async (id) => {
        await pool.query(
            "INSERT INTO game_dev (game_id, developer_id) VALUES ($1, $2);",
            [rows[0].id, id]
        );
    });
}

exports.updateGame = async (id, name, description, date, price, quantity, url, genresID, developersID) => {
    await Promise.all([pool.query("UPDATE games SET name=$1, description=$2, release_date=$3, price=$4, quantity=$5, cover_url=$6 WHERE id=$7;", [name, description, date, price, quantity, url, id]),
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
    const { rows } = await pool.query("SELECT games.id AS id, games.cover_url, games.name, games.description, TO_CHAR(games.release_date, 'YYYY-MM-DD') AS release_date, JSON_AGG(DISTINCT genres.name) AS genres, games.price, games.quantity FROM games LEFT JOIN game_genre ON games.id=game_genre.game_id LEFT JOIN genres ON genre_id=genres.id LEFT JOIN game_dev ON games.id=game_dev.game_id LEFT JOIN developers ON developer_id=developers.id GROUP BY games.id, games.name, games.release_date ORDER BY games.name;")
    return rows;
}

exports.deleteGame = async (id) => {
    await Promise.all([
        pool.query("DELETE FROM games WHERE id=$1;", [id]),
        pool.query("DELETE FROM game_genre WHERE game_id=$1;", [id]),
        pool.query("DELETE FROM game_dev WHERE game_id=$1;", [id]),
    ]);
}