const db = require('../db/queries');
const asyncHandler = require('express-async-handler');



exports.getGenres = asyncHandler (async (req, res) => {
    const result = await db.getAllGenres();
    res.render('index', {title: 'Genres', genres: result[0].genres});
})