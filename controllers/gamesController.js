const db = require('../db/queries');
const asyncHandler = require('express-async-handler');



exports.getGenreGames = asyncHandler (async (req, res) => {
    const id = req.params.id;
    const result = await db.getGenreGames(id);
    res.render('genre', {title: 'Games', games: result});
})

exports.getGame = asyncHandler(async (req, res) => {
    const gameID = req.params.game;
    const result = await db.getGame(gameID);
    res.render('game', {title: result[0].name, game: result});
})

exports.gameForm = asyncHandler (async (req, res) => {
    const result = await db.getAllGenres();
    res.render('add_game', {title: 'Add a new game', genres: result})
});


exports.addGame = async (req, res) => {
    const { game_name, game_description, game_date, game_quantity, game_url, genres} = req.body;
        try {
            await db.insertGame(game_name, game_description, game_date, game_quantity, game_url, genres);
        } catch (error) {
            res.locals.message = error.message || "An unexpected error occurred";
        } 
        finally {
            if(!res.locals.message) {
                res.locals.message = 'Success';
            }
            const result = await db.getAllGenres();
            res.render('add_game', {title: 'Add a new game', genres: result});
        }
}