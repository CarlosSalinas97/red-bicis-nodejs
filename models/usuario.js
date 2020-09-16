var mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
var Reserva = require('./reserva')
var bcrypt = require('bcrypt')
var crypto = require('crypto')
const saltRounds = 10

const mailer = require('../mailer/mailer')
const Token = require('../models/token')

var Schema = mongoose.Schema

const validacionEmail = function(email){
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return re.test(email)
}

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true, //Saca espacios vacios
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validacionEmail, 'Por favor, ingrese un email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password:{
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado:{
        type: Boolean,
        default: false
    }
})

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otra cuenta'})

usuarioSchema.pre('save', function(next){ //Antes de hacer el save, ejecuta function(next)
    if (this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds)
    }
    next()
})

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta})
    console.log(reserva)
    reserva.save(cb)
}

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')})
    const email_destination = this.email
    token.save(function(err){
        if (err){
            return console.log(err.message)
        }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificacion de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar haga click: \n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '.\n'
        }

        mailer.sendMail(mailOptions,function(err){
            if (err) {return console.log(err.message)}

            console.log('La verificacion fue enviada a: '+ email_destination)
        })
    })
}

usuarioSchema.methods.resetPassword = function(cb){
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')})
    const email_destination = this.email
    token.save(function (err){
        if (err) {return cb(err)}

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para resetear haga click: \n' + 'http://localhost:3000' + '\/resetPassword\/' + token.token + '.\n'
        }

        mailer.sendMail(mailOptions, function(err){
            if (err) {return cb(err)}
            console.log('Se envio el email a: '+ email_destination)
        })

        cb(null)
    })
}

usuarioSchema.statics.findOrCreate = function findOrCreate(condition, callback){
    const self = this
    console.log(condition)
    self.findOne({
        $or:[
            {'googleId': condition.id},{'email': condition.emails.value}
        ]
    }, (err, result) => {
        if (result) {
            callback(err, result)
        }else{
            console.log('-------------------- CONDITION -----------------')
            console.log(condition)
            let values = {}
            values.googleId = condition.id
            values.email = condition.emails[0].value
            values.nombre = condition.displayName || 'SIN NOMBRE'
            values.verificado = true
            values.password = condition._json.etag
            console.log('----------------------- VALUES ---------------------')
            console.log(values)
            self.create(values, (err, result) => {
                if (err) {console.log(err)}
                return callback(err, result)
            })
        }
    })
}


module.exports = mongoose.model('Usuario',usuarioSchema)