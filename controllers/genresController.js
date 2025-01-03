const db = require('../db/queries');
const asyncHandler = require('express-async-handler');



exports.getGenres = asyncHandler (async (req, res) => {
    const result = await db.getAllGenres();
    res.render('index', {title: 'Genres', genres: result});
})

exports.genreForm = asyncHandler ((req, res) => res.render('create_genre', {title: 'Add a new genre'}));



exports.addGenre = async (req, res) => {
    const { genre_name, genre_url} = req.body;
    try {
        await db.insertGenre(genre_name, genre_url);
    } catch (error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } 
    finally {
        if(!res.locals.message) {
            res.locals.message = 'Success';
        }
        res.render('create_genre', {title: 'Add a new genre'});
    }
}

exports.emptyGenre = async (req, res) => {
    const id = req.params.id;
    try {
        await db.emptyGenre(id);
    } catch (error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } 
    finally {
        const message = res.locals.message || 'Success';
        res.redirect(`/genre/edit/${id}?message=${encodeURIComponent(message)}`);
    }
}

exports.editGenre = async (req, res) => {
    const id = req.params.id;
    let genre;
    try {
        genre = await db.getGenre(id);
    } catch (error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } 
    finally {
        res.locals.message = res.locals.message || req.query.message;
        res.render('edit_genre', {title: 'Edit Genre', genre: genre[0]});
    }
}

exports.updateGenre = async (req, res) => {
    const id = req.params.id;
    const { genre_name, genre_url } = req.body;
    try {
        await db.updateGenre(id, genre_name, genre_url)
    } catch (error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } finally {
        const message = res.locals.message || 'Success';
        res.redirect(`/genre/edit/${id}?message=${encodeURIComponent(message)}`);
    }
}



