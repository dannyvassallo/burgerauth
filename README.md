#Burger With Auth

Generate User model & install bcrypt:

```shell
sequelize model:create --name User --attributes 'email:string password:string'
npm i -S bcrypt-nodejs
```

Update User model:

```javascript
'use strict';

var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    instanceMethods: {
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
    }
  });

  User.hook('beforeCreate', function(user, options) {
    user.password = user.generateHash(user.password);
  });

  return User;
};
```

Install passport, local strategy, express session

```
npm i -S passport passport-local express-session connect-flash
```

Setup passport configuration:

```javascript
'use strict'

var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
models = require('./models');

module.exports = function(app){
  // Serialize

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  // Deserialize

  passport.deserializeUser(function(user, done) {
    models.user.findById(user.id, function(err, user) {
      done(err, user);
    });
  });

  // For login purposes

  passport.use('local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(username, password, done){
      models.user.findOne({ where: {email: username} }).then(function(user){
        if (!user) {
          console.log("USER NOT FOUND");
          return done(null, false);
        }
        if (!user.validPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  ));

// For Signup purposes

  passport.use('local-signup', new LocalStrategy({
      passReqToCallback: true,
      usernameField: 'email',
      passwordField: 'password'
    },
    function(req, username, password, done){
      models.user.create({
        email: username,
        password: password
      }).then(function(user) {
        return done(null, user);
      }).catch(function() {
        return done(null, false);
      });
    }
  ));

}
```
