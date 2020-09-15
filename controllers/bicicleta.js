var Bicicleta = require('../models/bicicleta')

exports.Bicicleta_list = function(req,res){
    Bicicleta.allBicis(function(err, result){
        res.render('bicicletas/index',{data: result})
    })
}

exports.Bicicleta_create_get = function(req,res){
    res.render('bicicletas/create')
}

exports.Bicicleta_create_post = function(req,res){
    let bicicleta = new Bicicleta({
        codigo: req.body.id, 
        color: req.body.color, 
        modelo: req.body.modelo,
        ubicacion: [req.body.latitud, req.body.longitud]
    })

    Bicicleta.add(bicicleta, function(err, newElement){
        console.log(err)
        res.redirect('/bicicletas')
    })
}

exports.Bicicleta_delete_post = function(req,res){
    Bicicleta.removeByCode(req.params.id, function(err){
        console.log(err)
        res.redirect('/bicicletas')
    })

    
}

exports.Bicicleta_update_get = function(req,res){
    Bicicleta.findById(req.params.id, function(err, bicicleta){
        res.render('bicicletas/update',{bicicleta: bicicleta})
    })
    
}

exports.Bicicleta_update_post = function(req,res){
    Bicicleta.findById(req.params.id, function(err, bicicleta){
        bicicleta.id = req.body.id
        bicicleta.color = req.body.color
        bicicleta.modelo = req.body.modelo
        bicicleta.ubicacion = [req.body.latitud, req.body.longitud]
        bicicleta.save()

        res.redirect('/bicicletas')
    })
}