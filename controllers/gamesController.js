const gamesDB = require('../db/gameQueries');
const devsDB = require('../db/developerQueries');
const genresDB = require('../db/genreQueries');
const asyncHandler = require('express-async-handler');


exports.getAllGames = asyncHandler (async (req, res) => {
    const games = await gamesDB.getAllGames();
    res.render('games', {title: 'All Games', games: games});
})


exports.getGenreGames = asyncHandler (async (req, res) => {
    const id = req.params.id;
    const result = await gamesDB.getGenreGames(id);
    res.render('games', {title: 'Games', games: result});
})

exports.getGame = asyncHandler(async (req, res) => {
    const gameID = req.params.game;
    const result = await gamesDB.getGame(gameID);
    res.render('game', {title: result[0].name, game: result});
})

exports.gameForm = asyncHandler (async (req, res) => {
    const genres = await genresDB.getAllGenres();
    const devs = await devsDB.getAllDevelopers();
    res.render('add_game', {title: 'Add a new game', genres: genres, devs: devs})
});


exports.addGame = async (req, res) => {
    let { game_name, game_description, game_date, game_quantity, game_url, genres, developers} = req.body;
    genres = Array.isArray(genres) ? genres : [];
    game_quantity = game_quantity === '' ? 0 : game_quantity;
    game_date = game_date ? game_date : null;
    developers = Array.isArray(developers) ? developers : [];
        try {
            await gamesDB.insertGame(game_name, game_description, game_date, game_quantity, game_url, genres, developers);
        } catch (error) {
            res.locals.message = error.message || "An unexpected error occurred";
        } 
        finally {
            if(!res.locals.message) {
                res.locals.message = 'Success';
            }
            const genres = await genresDB.getAllGenres();
            const devs = await devsDB.getAllDevelopers();
            res.render('add_game', {title: 'Add a new game', genres: genres, devs: devs});
        }
}

exports.removeGame = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await gamesDB.deleteGame(id);
    res.redirect(req.get("Referrer") || '/');
})

exports.editGame = async (req, res) => {
    const id = req.params.id;
    let game;
    let genres;
    let devs;
    try {
        game = await gamesDB.getGame(id);
        genres = await genresDB.getAllGenres();
        devs = await devsDB.getAllDevelopers();
    } catch(error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } finally {
        res.locals.message = res.locals.message || req.query.message;
        res.render('edit_game', {title: 'Edit Game', game: game[0], genres: genres, devs: devs})
    }
    
}

exports.updateGame = async (req, res) => {
        const id = req.params.id;
        let {game_name, game_description, game_date, game_quantity, game_url, genres, developers } = req.body;
        genres = Array.isArray(genres) ? genres : [];
        game_quantity = game_quantity === '' ? 0 : game_quantity;
        game_date = game_date ? game_date : null;
        developers = Array.isArray(developers) ? developers : [];
        try {
            await gamesDB.updateGame(id, game_name, game_description, game_date, game_quantity, game_url, genres, developers);
        } catch (error) {
            res.locals.message = error.message || "An unexpected error occurred";
        } finally {
            const message = res.locals.message || 'Success';
            res.redirect(`/games/edit/${id}?message=${encodeURIComponent(message)}`);
        }
}