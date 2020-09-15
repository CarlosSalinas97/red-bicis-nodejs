var mongoose = require('mongoose')
var Bicicleta = require('../../models/bicicleta')
var request = require('request')
var server = require('../../bin/www')

beforeAll((done) => { mongoose.connection.close(done) });

var base_url = 'http://localhost:3000/api/bicicletas'

describe('Bicicleta API',()=>{

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



    describe('GET BICICLETAS /',()=>{
        it('Status 200',()=>{
            request.get(base_url, function(error,response,body){
                var result = JSON.parse(body)
                expect(response.statusCode).toBe(200)
                expect(result.bicicletas.length).toBe(0)
                done()
            })
        })
    })

    describe('POST BICICLETAS /create',()=>{
        it('Status 200',(done)=>{
            var headers = {'content-type' : 'application/json'}
            var aBici = '{"id": 10, "color": "rojo", "modelo": "urbana", "latitud": -27.452092, "longitud": -58.985414}'
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aBici
            },function(error,response,body){
                expect(response.statusCode).toBe(200)
                var bici = JSON.parse(body).bicicleta
                console.log(bici)
                expect(bici.color).toBe("rojo")
                expect(bici.modelo).toBe("urbana")
                done()
            })
        })
    })
})