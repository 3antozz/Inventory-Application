const { Router } = require("express");
const gamesRouter = Router();
const gamesController = require('../controllers/gamesController');

gamesRouter.get('/add', gamesController.gameForm);
gamesRouter.post('/add', gamesController.addGame);

gamesRouter.get('/:game', gamesController.getGame);






module.exports = gamesRouter;



