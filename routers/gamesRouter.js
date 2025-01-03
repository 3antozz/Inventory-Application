const { Router } = require("express");
const gamesRouter = Router();
const gamesController = require('../controllers/gamesController');


gamesRouter.get('/:game', gamesController.getGame);





module.exports = gamesRouter;



