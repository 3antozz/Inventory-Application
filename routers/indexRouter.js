const { Router } = require("express");
const indexRouter = Router();
const genresController = require('../controllers/genresController');
const gamesController = require('../controllers/gamesController');

indexRouter.get('/', genresController.getGenres);
indexRouter.get('/genre/:genre', gamesController.getGenreGames);
indexRouter.get('/games/:game', gamesController.getGame);

module.exports = indexRouter;
