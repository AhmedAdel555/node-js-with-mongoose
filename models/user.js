const getDB = require('../util/database').getDB
const mongo = require('mongodb')
const db = require('../util/database')

module.exports = class User{
    constructor(name, email ,password){
        this.name = name
        this.password = password
        this.email = email
        this.cart = {items:[]}
    }

    save(){
        const db = getDB()
        return db.collection('users').insertOne(this)
    }

    static addToCart(productID, userId){
        const db = getDB()
        return db.collection('users').findOne({_id: new mongo.ObjectId(userId)})
        .then((user) => {
            console.log(user)
            let itemIndex = user.cart.items.findIndex((prod) => {
                return prod.productID == productID
            })
            let updatedCartItems = [...user.cart.items]
            let itemQuantity = 1
            if(itemIndex >= 0){
                updatedCartItems[itemIndex].quantity += itemQuantity
                user.cart.items = updatedCartItems
            }
            else{
                updatedCartItems.push({productID: productID, quantity:itemQuantity})
                user.cart.items = updatedCartItems
            }
            return db.collection('users').updateOne({_id: new mongo.ObjectId(userId)}, {
                $set: {cart: {items:updatedCartItems}}
            })
        })
    }

    static getCart(userId){
        const db = getDB()
        return db.collection('users').findOne({_id: new mongo.ObjectId(userId)})
        .then((user) => {
            return user.cart.items
        })
    }

    static deleteFromCart(productID,userId){
        const db = getDB()
        return db.collection('users').findOne({_id: new mongo.ObjectId(userId)})
        .then((user) => {
            let itemIndex = user.cart.items.findIndex((prod) => {
                return prod.productID == productID
            })
            console.log(productID)
            console.log(itemIndex)
            user.cart.items.splice(itemIndex, 1)
            let updatedCartItems = user.cart.items
            return db.collection('users').updateOne({_id: new mongo.ObjectId(userId)}, {
                $set: {cart: {items:updatedCartItems}}
            })
        })
    }

    static addOrder(userID){
        const db = getDB()
        return db.collection('users').findOne({_id: new mongo.ObjectId(userID)})
        .then((user) => {
            db.collection('orders').insertOne({userID: userID , items:user.cart.items})
            db.collection('users').updateOne({_id: new mongo.ObjectId(userID)}, {
                $set: {cart: {items:[]}}
            })
        })
    }

    static getOrders(userID){
        const db = getDB()
        return db.collection('orders').find({userID: new mongo.ObjectId(userID)}).toArray()
    }

    static getById(userId){
        const db = getDB()
        return db.collection('users').findOne({_id: new mongo.ObjectId(userId)})
    }
}