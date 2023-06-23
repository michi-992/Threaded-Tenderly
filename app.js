// import the 'express' module and create an instance of the Express application and define the port number for the server
const express = require('express');
const app = express();
const port = 3000;

const path = require('path'); // import the 'path' module
const db = require('./services/database.js'); // import the service for database connection from './services/database.js'


app.use(express.static('public')); // serve static files from the 'public' directory

// import the 'ejs' module (js templating tool) for rendering views set the views directory (call render with only the ejs filename instead of the whole path) and set view engine
const ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// enables Cross-Origin Resource Sharing (CORS) - it allows requests from different origins to access resources on the server
const cors = require('cors');
app.use(cors());

// enables file uploads with 'express-fileupload' middleware and the server can use the module and any necessary parent directories for uploaded files are automatically created
const fileUpload = require('express-fileupload');
app.use(fileUpload({createParentPath: true}));


// import the 'body-parser' module for parsing different kinds of request bodies (using it to parse JSON request bodies and URL-encoded request bodies with extended options)
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// import the 'cookie-parser' module for parsing cookies from incoming requests
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// import the 'indexRouter' and 'privateRouter' instances of routers
const indexRouter = require('./routes/index');
const profileRouter = require('./routes/profile');


// register the 'indexRouter' for handling requests to the root URL ('/')
app.use('/', indexRouter);
// register the 'profileRouter' for handling requests to the '/profile' URL
app.use('/profile', profileRouter);


// the function catches the error and renders the 404 page while logging the error
function errorHandler(err, req, res) {
    console.log(err);
    res.render('404');
}
// the server uses the errorHandler function
app.use(errorHandler);

// start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});