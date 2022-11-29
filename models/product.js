const mongo = require('mongodb')
const getDB = require('../util/database').getDB
module.exports = class Product{
    constructor(title, image, price, description, userId){
        this.title = title.trim()
        this.image = image.trim()
        this.price = +price.trim()
        this.description = description.trim()
        this.userId = userId
    }
    save(){
        const db = getDB()
        return db.collection('products')
        .insertOne(this)
        .then((result) => {
            console.log(result)
        })
    }
    static fetchAll(){
        const db = getDB()
        return db.collection('products').find().toArray()
    }
    static getById(prodID){
        const db = getDB()
        return db.collection('products')
        .find({_id: new mongo.ObjectId(prodID)}).next()
    }
    static editProduct(prodID, product){
        const db = getDB()
        return db.collection('products')
                .updateOne({_id: new mongo.ObjectId(prodID)}, {$set: {title:product.title , 
                                                                        image:product.image, 
                                                                        price:product.price, 
                                                                        description:product.description}})
    }

    static deleteById(prodID){
        const db = getDB()
        return db.collection('products').deleteOne({ _id: new mongo.ObjectId(prodID)})
    }
}