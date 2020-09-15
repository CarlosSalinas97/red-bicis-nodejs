var mongoose = require('mongoose')
var Schema = mongoose.Schema

var bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: { type: '2dsphere', sparse: true}
    }
})

bicicletaSchema.statics.createInstance = function(codigo,color,modelo,ubicacion){
    return new this({
        codigo: codigo,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    })
}

bicicletaSchema.statics.updateInstance = function (codigo, newcodigo, color, modelo, ubicacion) {  
    this.findOne({ codigo: codigo }, function (err, doc){
        doc.codigo = newcodigo;
        doc.color = color;
        doc.model = modelo;
        doc.ubicacion = ubicacion;
        doc.save();
    });
};

bicicletaSchema.methods.toString = function(){
    return 'codigo: '+this.codigo+' | color: '+this.color
}

bicicletaSchema.statics.allBicis = function(cb){
    return this.find({}, cb)
}

bicicletaSchema.statics.add = function(aBici, cb){
    this.create(aBici,cb)
}

bicicletaSchema.statics.findByCode = function(aCode,cb){
    return this.findOne({code: aCode}, cb)
}

bicicletaSchema.statics.removeByCode = function(aCode, cb){
    return this.deleteOne({code: aCode}, cb)
}

module.exports = mongoose.model('Bicicleta',bicicletaSchema)



/*var Bicicleta = function(id,color,modelo,ubicacion){
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.allBicis = []
Bicicleta.add = function(aBici){
    Bicicleta.allBicis.push(aBici)
}

Bicicleta.findById = function(aBiciId){
    var aBici = Bicicleta.allBicis.find(x => x.id == aBiciId)
    if (aBici){
        return aBici
    } else{
        throw new Error(`No existe una bicicleta con el ID: ${aBiciId}`)
    }
}

Bicicleta.removeById = function(aBiciId){
    for (var i = 0; i<Bicicleta.allBicis.length; i++){
        if (Bicicleta.allBicis[i].id == aBiciId){
            Bicicleta.allBicis.splice(i,1)
            break
        }
    }
}

var a = new Bicicleta(1,'rojo','urbana',[-27.452092, -58.985414])
var b = new Bicicleta(2,'blanca','urbana',[-27.453720, -58.989314])

Bicicleta.add(a)
Bicicleta.add(b)


module.exports = Bicicleta*/