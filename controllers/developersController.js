const gamesDB = require('../db/gameQueries');
const devsDB = require('../db/developerQueries');
const asyncHandler = require('express-async-handler');



exports.getAllDevs = asyncHandler(async (req, res) => {
    const devs = await devsDB.getAllDevelopers();
    res.render('developers', {title: 'Developers', devs: devs});
})

exports.devForm = asyncHandler(async (req, res) => {
    res.render('add_dev', {title: 'Add a developer'});
});

exports.addDev = async (req, res) => {
    const { dev_name, dev_year} = req.body;
    try {
        await devsDB.insertDev(dev_name, dev_year);
    } catch (error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } 
    finally {
        if(!res.locals.message) {
            res.locals.message = 'Success';
        }
        res.render('add_dev', {title: 'Add a developer'});
    }
}

exports.editDev = async (req, res) => {
    const id = req.params.id;
    let dev;
    try {
        dev = await devsDB.getDev(id);
    } catch(error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } finally {
        res.locals.message = res.locals.message || req.query.message;
        res.render('edit_dev', {title: 'Edit developer', dev: dev[0]});
    }
}

exports.updateDev = async (req, res) => {
    const id = req.params.id;
    const { dev_name, dev_year} = req.body;
    try {
        await devsDB.updateDev(id, dev_name, dev_year);
    } catch(error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } finally {
        const message = res.locals.message || 'Success';
        res.redirect(`/devs/edit/${id}?message=${encodeURIComponent(message)}`);
    }
}

exports.clearDev = async (req, res) => {
    const id = req.params.id;
    try {
        await devsDB.emptyDev(id);
    } catch (error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } 
    finally {
        const message = res.locals.message || 'Success';
        res.redirect(`/devs/edit/${id}?message=${encodeURIComponent(message)}`);
    }
}

exports.getDevGames = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await gamesDB.getDevGames(id);
    res.render('games', {title: 'Games', games: result});
})

