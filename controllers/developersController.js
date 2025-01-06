const gamesDB = require('../db/gameQueries');
const devsDB = require('../db/developerQueries');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');



exports.getAllDevs = asyncHandler(async (req, res) => {
    const devs = await devsDB.getAllDevelopers();
    res.render('developers', {title: 'Developers', devs: devs});
})

exports.devForm = asyncHandler(async (req, res) => {
    if(req.query.message) {
        res.locals.message = req.query.message;
    }
    res.render('add_dev', {title: 'Add a developer'});
});

const validateDev = [
    body('dev_name').trim().notEmpty().withMessage('Please enter a developer name'),
    body('dev_logo').trim().optional({values: 'falsy'}).isURL().withMessage('URL must be a valid URL'),
    body('dev_year').trim().notEmpty().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Year must be a valid number between 1900 and the current year')
];

exports.addDev =[validateDev, async (req, res) => {
    const { dev_name, dev_logo, dev_year} = req.body;
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        return res.render('add_dev', {title: 'Add a developer', errors: validation.array()});
    }
    try {
        await devsDB.insertDev(dev_name, dev_logo, dev_year);
    } catch (error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } 
    finally {
        if(!res.locals.message) {
            res.locals.message = 'Success';
        }
        res.render('add_dev', {title: 'Add a developer'});
    }
}]

exports.editDev = async (req, res) => {
    const id = req.params.id;
    let dev;
        if(req.query.validation) {
            dev = await devsDB.getDev(id);
            return res.render('edit_dev', {title: 'Edit developer', dev: dev[0], validation: JSON.parse(req.query.validation)});
        }
    try {
        dev = await devsDB.getDev(id);
    } catch(error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } finally {
        res.locals.message = res.locals.message || req.query.message;
        res.render('edit_dev', {title: 'Edit developer', dev: dev[0]});
    }
}

exports.updateDev = [validateDev, async (req, res) => {
    const id = req.params.id;
    const { dev_name, dev_logo, dev_year} = req.body;
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        const messages = validation.array().map((err) => err.msg)
        const encodedErrors = encodeURIComponent(JSON.stringify(messages));
        return res.redirect(`/devs/edit/${id}?validation=${encodedErrors}`);
    }
    try {
        await devsDB.updateDev(id, dev_name, dev_logo, dev_year);
    } catch(error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } finally {
        const message = res.locals.message || 'Success';
        res.redirect(`/devs/edit/${id}?message=${encodeURIComponent(message)}`);
    }
}]

exports.removeDev = async (req, res) => {
    const id = req.params.id;
    try {
        await devsDB.removeDev(id);
    } catch (error) {
        res.locals.message = error.message || "An unexpected error occurred";
    } 
    finally {
        const message = res.locals.message || 'Success';
        res.redirect(`/devs/add?message=${encodeURIComponent(message)}`);
    }
}

exports.getDevGames = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await gamesDB.getDevGames(id);
    res.render('games', {title: 'Games', games: result});
})

