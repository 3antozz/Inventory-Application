const { Router } = require("express");
const gamesRouter = Router();
const gamesController = require('../controllers/gamesController');

gamesRouter.get('/add', gamesController.gameForm);
gamesRouter.post('/add', gamesController.addGame);

gamesRouter.get('/all', gamesController.getAllGames);

gamesRouter.get('/edit/:id', gamesController.editGame);
gamesRouter.post('/edit/:id', gamesController.updateGame);

gamesRouter.post('/delete/:id', gamesController.removeGame);

gamesRouter.get('/:game', gamesController.getGame);







module.exports = gamesRouter;



