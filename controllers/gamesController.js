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