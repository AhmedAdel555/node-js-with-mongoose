const db = require('../util/database')
module.exports = class Product{
    constructor(title, image, price, description){
        this.title = title.trim()
        this.image = image.trim()
        this.price = +price.trim()
        this.description = description.trim()
    }
    save(){
        return db.execute('INSERT INTO products (title,price,description,imageURL) VALUES (?,?,?,?)',
        [this.title,this.price,this.description,this.image])
    }
    static fetchAll(){
        return db.execute('select * from products')
    }
    static getById(ID){
      return db.execute('select * from products where id = ?',[ID])
    }
    static editProduct(id , product){
       return db.execute('UPDATE products SET title = ? , price = ? , description = ? , imageURL = ? WHERE id = ? ;', 
       [product.title , product.price , product.description , product.image , id])
    }
    static deleteProduct(id){
        return db.execute('DELETE FROM products WHERE id = ? ', [id])
        .then(() => {
            return db.execute('DELETE FROM cart_item where productID = ?', [id])
       })
    }
}