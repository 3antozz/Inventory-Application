const { Router } = require("express");
const indexRouter = Router();
const genresController = require('../controllers/genresController');
const gamesController = require('../controllers/gamesController');

indexRouter.get('/', genresController.getGenres);
indexRouter.get('/genre/:genre', gamesController.getGenreGames);
indexRouter.get('/games/:game', gamesController.getGame);
indexRouter.get('/create_genre', genresController.genreForm);
indexRouter.post('/create_genre', genresController.addGenre);

module.exports = indexRouter;
