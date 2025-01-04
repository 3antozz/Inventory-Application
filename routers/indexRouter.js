const { Router } = require("express");
const indexRouter = Router();
const genresController = require('../controllers/genresController');
const genresRouter = require('./genresRouter');
const gamesRouter = require('./gamesRouter');
const devRouter = require('./developersRouter');

indexRouter.get('/', genresController.getGenres);
indexRouter.use('/genre', genresRouter);
indexRouter.use('/games', gamesRouter);
indexRouter.use('/devs', devRouter);



module.exports = indexRouter;
