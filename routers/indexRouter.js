const { Router } = require("express");
const indexRouter = Router();
const genresController = require('../controllers/genresController');
const genresRouter = require('./genresRouter');
const gamesRouter = require('./gamesRouter');

indexRouter.get('/', genresController.getGenres);
indexRouter.use('/genre', genresRouter)
indexRouter.use('/games', gamesRouter)



module.exports = indexRouter;
