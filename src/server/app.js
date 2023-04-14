const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const moment = require('moment');
const compression = require('compression');
const mongoose = require('mongoose');
const fs = require('fs');
const fetch = require('node-fetch');
const handlebars = require('express-handlebars')
const { v4: uuidv4 } = require('uuid');
const session = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const flash = require('connect-flash');
const app = express();
const personUsersSchema = mongoose.model('personUsersSchema');

// Helmet will set various HTTP headers to help protect your app
app.use(helmet());
// support parsing of application/json type post data
app.use(bodyParser.json({ limit: '50mb' }));
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({extended: true}));
// support compress response headers
app.use(compression());
// support parse cookie
app.use(cookieParser());
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: {
        if_eq: function(a, b, opts) {
            if (a == b) {
                return opts.fn(this);
            } else {
                return opts.inverse(this);
            }
        }
    }
}));
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, '../client')));
app.use(session({
  keys: ['secretkeasdasdy1', 'se221dsadcretkey2'],
  secret: 'Namkn223sd',
  name: 'ya_mod_1',
  maxAge: 1000 * 60 * 60 * 24 * 7
}));
app.use(flash());

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
const userSchema = mongoose.model('userSchema');
passport.use(new LocalStrategy(userSchema.authenticate()));

passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

var routeAdmin = require('./route/admin.js');
var routeMain = require('./route/main.js');
var routeSystem = require('./route/system.js');
var routeApi = require('./route/api.js');

app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

app.use('/', routeMain);
app.use('/admin', routeAdmin);
app.use('/system', routeSystem);
app.use('/api', routeApi);

app.use(function(req, res, next) {
  res.status(404).render('404');
});

module.exports = app;
