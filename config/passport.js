const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const Usuario = require('../models/usuario')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new localStrategy(
    function(email, password, done){
        Usuario.findOne({email: email}, function(err, usuario){
            if (err) return done(err)
            if (!usuario) return done(null, false, {message: 'Email no existente o incorrecto'})
            if (!usuario.validPassword(password)) return done(null, false, {message: 'Password incorrecto'})
            //Se puede agregar aca, verificar si el usuario esta verificado

            return done(null, usuario)
        })
    }
))


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://red-bicicletas-salinas.herokuapp.com/auth/google/callback"
},
    function(accessToken, refreshToken, profile, cb) {
        Usuario.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
))

passport.serializeUser(function(user, cb){
    cb(null, user.id)
})

passport.deserializeUser(function(id, cb){
    Usuario.findById(id, function(err, usuario){
        cb(err, usuario)
    })
})

module.exports = passport