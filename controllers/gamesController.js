const db = require('../db/queries');
const asyncHandler = require('express-async-handler');


exports.getAllGames = asyncHandler (async (req, res) => {
    const games = await db.getAllGames();
    res.render('games', {title: 'All Games', games: games});
})


exports.getGenreGames = asyncHandler (async (req, res) => {
    const id = req.params.id;
    const result = await db.getGenreGames(id);
    res.render('games', {title: 'Games', games: result});
})

exports.getGame = asyncHandler(async (req, res) => {
    const gameID = req.params.game;
    const result = await db.getGame(gameID);
    res.render('game', {title: result[0].name, game: result});
})

exports.gameForm = asyncHandler (async (req, res) => {
    const genres = await db.getAllGenres();
    const devs = await db.getAllDevelopers();
    res.render('add_game', {title: 'Add a new game', genres: genres, devs: devs})
});


exports.addGame = async (req, res) => {
    const { game_name, game_description, game_date, game_quantity, game_url, genres, developers} = req.body;
        try {
            await db.insertGame(game_name, game_description, game_date, game_quantity, game_url, genres, developers);
        } catch (error) {
            res.locals.message = error.message || "An unexpected error occurred";
        } 
        finally {
            if(!res.locals.message) {
                res.locals.message = 'Success';
            }
            const genres = await db.getAllGenres();
            const devs = await db.getAllDevelopers();
            res.render('add_game', {title: 'Add a new game', genres: genres, devs: devs});
        }
}

exports.removeGame = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await db.deleteGame(id);
    res.redirect(req.get("Referrer") || '/');
})