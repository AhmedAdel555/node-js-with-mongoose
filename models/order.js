const db = require('../util/database')

module.exports = class Order{
    constructor(userID, totalPrice){
        this.userID = userID,
        this.totalPrice = totalPrice
    }
    static addOrder(userID){
        let id = 0
        let productsList = []
        return db.execute('select totalPrice, cartID from cart where userID = ?', [userID])
        .then((data) => {
            id = data[0][0].cartID
            db.execute('UPDATE cart set totalPrice = ? where userID = ?', [0,userID])
            return db.execute('INSERT INTO orders (totalPrice,PersonID) VALUES(?,?)', [data[0][0].totalPrice, userID])
        .then(() => {
            return db.execute('select productID,quantity from cart_item where cartID = ?', [data[0][0].cartID])
        })
        }).then((products) => {
            productsList = products[0]
            db.execute('delete from cart_item where cartID = ?', [id])
            return db.execute('select OrderID from orders where PersonID = ?', [userID])
        }).then(async (orders) => {
            for(let i = 0 ; i < productsList.length ; i++){
                await db.execute('INSERT INTO order_items (OrderID, productID, quantity) VALUES (?,?,?)' , [orders[0][orders[0].length -1].OrderID, productsList[i].productID, productsList[i].quantity])
            }
            return 1;
        })
    }
    static getOrders(userID){
        return db.execute('select OrderID from orders where PersonID = ?',[userID])
        .then(async (orderIds) => {
            let orders = [] 
            let order
            for(let i = 0 ; i < orderIds[0].length ; i++){
                order = await db.execute('select productID, quantity from order_items where OrderId = ?', [orderIds[0][i].OrderID])
                if(order[0].length == 0){
                    continue
                }
                orders.push(order[0])
            }
            return orders
        })
    }
}