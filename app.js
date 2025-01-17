/* eslint-disable no-unused-vars */
const express = require("express");
const path = require("node:path");
const indexRouter = require("./routers/indexRouter");
const app = express();
const port = 3000;


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use('/public', express.static('node_modules/choices.js/public/assets'));

app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.use((req, res) => {
    throw new Error('404 NOT FOUND')
  });
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', {error: err.message});
});


app.listen(port, () =>
    console.log(`Server started successfully! Listening on port ${port}`)
);
