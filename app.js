const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const db = require('./services/database.js');

app.use(express.static('public'));

const ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const cookieParser = require('cookie-parser');
app.use(cookieParser());



const indexRouter = require('./routes/index');
const privateRouter = require('./routes/private');
app.use('/', indexRouter);
app.use('/private', privateRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});