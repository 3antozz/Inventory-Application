const genreDB = require('../db/genreQueries');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');



exports.getGenres = asyncHandler (async (req, res) => {
    const result = await genreDB.getAllGenres();
    res.render('index', {title: 'Genres', genres: result});
})

exports.genreForm = asyncHandler ((req, res) => res.render('create_genre', {title: 'Add a new genre'}));

const validateGenre = [
    body('genre_name').trim().notEmpty().withMessage('Please enter a genre name'),
    body('genre_url').trim().optional({values: 'falsy'}).isURL().withMessage('URL must be a valid URL')
];



exports.addGenre = [validateGenre, async (req, res) => {
    const { genre_name, genre_url} = req.body;
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        return res.render('create_genre', {title: 'Add a new genre', errors: validation.array()});
    }
    try {
        await genreDB.insertGenre(genre_name, genre_url);
    } catch (error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } 
    finally {
        if(!res.locals.message) {
            res.locals.message = 'Success';
        }
        res.render('create_genre', {title: 'Add a new genre'});
    }
}]

exports.emptyGenre = async (req, res) => {
    const id = req.params.id;
    try {
        await genreDB.emptyGenre(id);
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
    if(req.query.validation) {
        genre = await genreDB.getGenre(id);
        return res.render('edit_genre', {title: 'Edit Genre', genre: genre[0], validation: JSON.parse(req.query.validation)});
    }
    try {
        genre = await genreDB.getGenre(id);
    } catch (error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } 
    finally {
        res.locals.message = res.locals.message || req.query.message;
        res.render('edit_genre', {title: 'Edit Genre', genre: genre[0]});
    }
}

exports.updateGenre = [validateGenre, async (req, res) => {
    const id = req.params.id;
    const { genre_name, genre_url } = req.body;
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        const messages = validation.array().map((err) => err.msg)
        const encodedErrors = encodeURIComponent(JSON.stringify(messages));
        return res.redirect(`/genre/edit/${id}?validation=${encodedErrors}`);
    }
    try {
        await genreDB.updateGenre(id, genre_name, genre_url)
    } catch (error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } finally {
        const message = res.locals.message || 'Success';
        res.redirect(`/genre/edit/${id}?message=${encodeURIComponent(message)}`);
    }
}]



