const mongodb = require('mongodb')

const mongoClient = mongodb.MongoClient

let _db;

const mongoConnect = (listen) => {
    mongoClient.connect('mongodb+srv://ahmedadel:Ahmed3ff72@cluster0.wktfawr.mongodb.net/shop?retryWrites=true&w=majority')
    .then((result) => {
        console.log('Connected')
        _db = result.db()
        listen()
    }).catch((err) => {
        console.log(err)
        throw err
    })
}

const getDB = function(){
    if(_db){
        return _db
    }
    else{
        throw "no database found!"
    }
}

exports.mongoConnect = mongoConnect

exports.getDB = getDB



