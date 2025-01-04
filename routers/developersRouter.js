const { Router } = require("express");
const devRouter = Router();
const developersController = require('../controllers/developersController');


devRouter.get('/all', developersController.getAllDevs);


devRouter.get('/add', developersController.devForm);
devRouter.post('/add', developersController.addDev);

devRouter.get('/:id', developersController.getDevGames);

devRouter.get('/edit/:id', developersController.editDev);
devRouter.post('/edit/:id', developersController.updateDev);

devRouter.post('/clear/:id', developersController.clearDev)






module.exports = devRouter;