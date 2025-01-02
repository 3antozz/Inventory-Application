const db = require('../db/queries');
const asyncHandler = require('express-async-handler');



exports.getGenreGames = asyncHandler (async (req, res) => {
    const genre = req.params.genre;
    const result = await db.getGenreGames(genre);
    console.log(result);
    res.render('genre', {title: 'Games', games: result});
})