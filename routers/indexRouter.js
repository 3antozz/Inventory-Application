const { Router } = require("express");
const indexRouter = Router();
const genresController = require('../controllers/genresController');
const gamesController = require('../controllers/gamesController');

indexRouter.get('/', genresController.getGenres);

indexRouter.get('/genre/:id', gamesController.getGenreGames);
indexRouter.post('/genre/:id', genresController.emptyGenre);

indexRouter.get('/genre/edit/:id', genresController.editGenre);
indexRouter.post('/genre/edit/:id', genresController.updateGenre);

indexRouter.post('/genre/update/:id', genresController.updateGenre);

indexRouter.get('/games/:game', gamesController.getGame);

indexRouter.get('/create_genre', genresController.genreForm);
indexRouter.post('/create_genre', genresController.addGenre);

module.exports = indexRouter;
