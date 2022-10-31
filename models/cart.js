const db = require('../util/database')
const Product = require('../models/product')
module.exports = class Cart{
    static addToCart (idUser, idProduct ,price){
        return db.execute('select totalPrice, cartID from cart where userID = ?', [idUser])
        .then((data) => {
            db.execute('UPDATE cart SET totalPrice = ? WHERE userID = ?', [(data[0][0].totalPrice + price).toFixed(2), idUser])
            return db.execute('select quantity from cart_item where productID = ?' , [idProduct])
            .then(([qnt]) => {
                if(!qnt[0]){
                    return db.execute('INSERT INTO cart_item (cartID,productID,quantity) VALUES (?,?,?)', [data[0][0].cartID, idProduct , 1])
                }else{
                    return db.execute('UPDATE cart_item set quantity = ? where productID = ?', [qnt[0].quantity + 1 , idProduct])
                }
            })
        }
       )
    }

    static getcart(idUser){
        let totalPrice = 0
        return db.execute('select totalPrice, cartID from cart where userID = ?', [idUser])
        .then((data) => {
            totalPrice = data[0][0].totalPrice
            return db.execute('select productID,quantity from cart_item where cartId = ?', [data[0][0].cartID])
        }).then(async ([data]) => {
            let products = []
            for(let i = 0 ; i < data.length ; i++){
                let qnt = data[i].quantity
                await Product.getById(data[i].productID)
                .then(([params]) => {
                    products.push({...params[0], qnt})
                })
            }
            return products
        }).then((products) => {
            return {products:products,totalPrice:totalPrice}
        })
    }

    static deleteFromCart(idUser, idProduct ,price){
        return db.execute('select totalPrice, cartID from cart where userID = ?', [idUser])
        .then((data) => {
            return db.execute('select quantity from cart_item where productID = ?' , [idProduct])
            .then(([qnt]) => {
                return db.execute('UPDATE cart SET totalPrice = ? WHERE userID = ?', [(data[0][0].totalPrice - price * qnt[0].quantity).toFixed(2), idUser])
            }).then(() => {
                return db.execute('DELETE FROM cart_item where productID = ?' , [idProduct])
            })  
        })
    }

    static editTotalPrice(idUser){
        db.execute('select productID, quantity from cart_item where cartID = ?', [idUser])
        .then(async ([data]) => {
            let products = []
            for(let i = 0 ; i < data.length ; i++){
                let qnt = data[i].quantity
                await Product.getById(data[i].productID)
                .then(([params]) => {
                    products.push({...params[0], qnt})
                })
            }
            return products
        }).then((products) => {
            let sum = 0
            for(let i = 0 ; i < products.length ; i++){
                sum += products[i].price * products[i].qnt
            }
            return db.execute('UPDATE cart SET totalPrice = ? WHERE userID = ?', [sum.toFixed(2), idUser])
        })
    }
}