// Solution 1: Bulk Insert
// ===========================================

// This solution adds in a migration file
// to create dummy burger data.



// Step 1: Ran this in the command line
//         $ sequelize migration:create --name burgerInsert
//
// Step 2: Edited the up method of the migration file to add in five burgers
//
// Step 3: Edited the down method of the migration file to remove those burgers
//
// Step 4: Included a MySQL query in the down method to bring the primary ids
//         down to the lowest possible number. This prevents the occurrence
//         of id gaps resulting from deleting the burger entries
//
// Step 5: ran the commands and verified that they added the proper data to the table

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')

// bring in the models
var models = require('./models')

// sync the models
models.sequelize.sync();

var app = express();
//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + '/public'));

// required for passport
app.use(session({ secret: 'mySecretSession' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}))
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var routes = require('./controllers/burgers_controller.js');

app.use('/', routes);
app.use('/update', routes);
app.use('/create', routes);




// listen on port 3000
var port = process.env.PORT || 3000;
app.listen(port);

console.log(module.exports)
