const { Router } = require("express");
const genresRouter = Router();
const genresController = require('../controllers/genresController');
const gamesController = require('../controllers/gamesController');

genresRouter.get('/create', genresController.genreForm);
genresRouter.post('/create', genresController.addGenre);

genresRouter.post('/:id', genresController.emptyGenre);
genresRouter.get('/:id', gamesController.getGenreGames);

genresRouter.get('/edit/:id', genresController.editGenre);
genresRouter.post('/edit/:id', genresController.updateGenre);

genresRouter.post('/update/:id', genresController.updateGenre);






module.exports = genresRouter;