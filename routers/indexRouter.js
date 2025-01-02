const { Router } = require("express");
const indexRouter = Router();
const genresController = require('../controllers/genresController');
const gamesController = require('../controllers/gamesController');

indexRouter.get('/', genresController.getGenres)
indexRouter.get('/genre/:genre', gamesController.getGenreGames)

module.exports = indexRouter;
