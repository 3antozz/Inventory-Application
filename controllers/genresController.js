const db = require('../db/queries');
const asyncHandler = require('express-async-handler');



exports.getGenres = asyncHandler (async (req, res) => {
    const result = await db.getAllGenres();
    res.render('index', {title: 'Genres', genres: result});
})

exports.genreForm = asyncHandler ((req, res) => res.render('create_genre', {title: 'Add a new genre'}));



exports.addGenre = asyncHandler(async (req, res) => {
    const { genre_name, genre_url} = req.body;
    try {
        await db.insertGenre(genre_name, genre_url);
    } catch (error) {
        res.locals.errorMessage = [error.message || "An unexpected error occurred"];
    } 
    finally {
        if(!res.locals.errorMessage) {
            res.locals.errorMessage = ['Success'];
        }
        res.render('create_genre', {title: 'Add a new genre'});
    }
    
    
})

