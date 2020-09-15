var mongoose = require('mongoose')
var Bicicleta = require('../../models/bicicleta')
beforeAll((done) => { mongoose.connection.close(done) });

describe('Testing Bicicletas',function(){
    beforeEach(function(done){
        var mongoDB = 'mongodb://localhost/testdb'
        mongoose.disconnect()
        mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

       
        const db = mongoose.connection
        db.on('error', console.error.bind(console,'connection error'))
        db.once('open',function(){
            console.log('Me conecte a la db')
            done()
        })
    })

    afterEach(function(done){
        Bicicleta.deleteMany({}, function(err,success){
            if (err) console.log(err)
            done()
        })
    })

    describe('Bicicleta.createInstance',() => {
        it('crea una instancia de Bicicleta',() => {
            var bici = Bicicleta.createInstance(1,'verde','urbano',[-34.5,-54.1])

            expect(bici.code).toBe(1)
            expect(bici.color).toBe('verde')
            expect(bici.modelo).toBe('urbano')
            expect(bici.ubicacion[0]).toBe(-34.5)
            expect(bici.ubicacion[1]).toBe(-54.1)
        })
    })
    
    describe('Bicicleta.allBicis',() => {
        it('comienza vacia', (done) => {
            Bicicleta.allBicis(function(err,bicis){
                expect(bicis.length).toBe(0)
                done()
            })
        })
        
    })

    describe('Bicicleta.add', () => {
        it('agrega solo una bici', (done) => {
            var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"})
            Bicicleta.add(aBici, function(err, newBici){
                if (err) console.log(err)
                Bicicleta.allBicis(function(err, bicis){
                    expect(bicis.length).toBe(1)
                    expect(bicis[0].code).toEqual(aBici.code)
                    done()
                })
            })
        })
    })

    describe('Bicicleta.findByCode', () => {
        it('Debe devolver la bici con code 1', (done) => {
            Bicicleta.allBicis(function(err,bicis){
                expect(bicis.length).toBe(0)

                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"})
                Bicicleta.add(aBici, function(err, newBici){
                    if (err) console.log(err)

                    var aBici2 = new Bicicleta({code: 2, color: "rojo", modelo: "ruta"})
                    Bicicleta.add(aBici2, function(err, newBici){
                        if (err) console.log(err)
                        Bicicleta.findByCode(1, function(error, targetBici){
                            expect(targetBici.code).toBe(aBici.code)
                            expect(targetBici.color).toBe(aBici.color)
                            expect(targetBici.modelo).toBe(aBici.modelo)

                            done()
                        })
                    })
                })
            })
        })
    })
})