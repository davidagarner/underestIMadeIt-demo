// server.js


// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 7070;
const MongoClient = require('mongodb').MongoClient
var multer = require('multer');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var ObjectId = require('mongodb').ObjectID
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
const path = require('path')
const storage = multer.diskStorage({
  destination:'./public/uploads/',
   filename: function(req, file, cb ){
     console.log(file.fieldname);
     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) )
   }
  })
// const multer = require("multer");
// const upload = multer({ dest: "public/uploads/" });

const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000}
}).single('')

var configDB = require('./config/database.js');

var db




  

  // const multer = require("multer");
module.exports = {
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "/src/post-images");
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname);
    },
  }),
};

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db, multer, storage, upload, ObjectId);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
// app.use('public')

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
