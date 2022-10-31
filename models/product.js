const getDB = require('../util/database').getDB
module.exports = class Product{
    constructor(title, image, price, description){
        this.title = title.trim()
        this.image = image.trim()
        this.price = +price.trim()
        this.description = description.trim()
    }
    save(){
        const db = getDB()
    }
}