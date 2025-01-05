const gamesDB = require('../db/gameQueries');
const devsDB = require('../db/developerQueries');
const genresDB = require('../db/genreQueries');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');


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

const validateGame = [
    body('game_name').trim().notEmpty().withMessage('Please enter a game name'),
    body('game_description').trim().optional({values: 'falsy'}),
    body('game_date').trim().isDate().withMessage('Release date must be a valid date'),
    body('game_price').trim().notEmpty().withMessage('Please provide a price for the game').isInt({min: 0}).withMessage('Price must be a postive number'),
    body('game_quantity').trim().notEmpty().withMessage('Please provide the quantity').isInt({min: 0}).withMessage('Quantity must be a postive number'),
    body('game_url').trim().optional({values: 'falsy'}).isURL().withMessage('URL must be a valid URL'),
    body('genres').isArray({min: 1}).withMessage('Please choose 1 genre atleast'),
    body('developers').isArray({min: 1}).withMessage('Please choose 1 developer atleast'),
];


exports.addGame = [validateGame,async (req, res) => {
    let { game_name, game_description, game_date, game_price, game_quantity, game_url, genres, developers} = req.body;
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        const genress = await genresDB.getAllGenres();
        const devs = await devsDB.getAllDevelopers();
        return res.render('add_game', {title: 'Add a new game',genres: genress, devs: devs, errors: validation.array()});
    }
    genres = Array.isArray(genres) ? genres : [];
    game_quantity = game_quantity === '' ? 0 : game_quantity;
    game_price = game_price === '' ? 0 : game_price;
    game_date = game_date ? game_date : null;
    developers = Array.isArray(developers) ? developers : [];
        try {
            await gamesDB.insertGame(game_name, game_description, game_date, game_price, game_quantity, game_url, genres, developers);
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
}]

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
    if(req.query.validation) {
        game = await gamesDB.getGame(id);
        genres = await genresDB.getAllGenres();
        devs = await devsDB.getAllDevelopers();
        return res.render('edit_game', {title: 'Edit Game', game: game[0], genres: genres, devs: devs, validation: JSON.parse(req.query.validation)});
    }
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

exports.updateGame = [validateGame, async (req, res) => {
        const id = req.params.id;
        let {game_name, game_description, game_date, game_price, game_quantity, game_url, genres, developers } = req.body;
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            const messages = validation.array().map((err) => err.msg)
            const encodedErrors = encodeURIComponent(JSON.stringify(messages));
            return res.redirect(`/games/edit/${id}?validation=${encodedErrors}`);
        }
        genres = Array.isArray(genres) ? genres : [];
        game_quantity = game_quantity === '' ? 0 : game_quantity;
        game_price = game_price === '' ? 0 : game_price;
        game_date = game_date ? game_date : null;
        developers = Array.isArray(developers) ? developers : [];
        try {
            await gamesDB.updateGame(id, game_name, game_description, game_date, game_price, game_quantity, game_url, genres, developers);
        } catch (error) {
            res.locals.message = error.message || "An unexpected error occurred";
        } finally {
            const message = res.locals.message || 'Success';
            res.redirect(`/games/edit/${id}?message=${encodeURIComponent(message)}`);
        }
}]