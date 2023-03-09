const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    resetToken: { type:String},
    resetTokenExpiration:{ type:Date },
    cart:{
        items:[
            {
                productId: {type: Schema.Types.ObjectId, required:true, ref:'Product'},
                quantity: {type: Number, required:true}
            }
        ]
    }
})

userSchema.methods.addToCart =  function(productID){
    let itemIndex = this.cart.items.findIndex((prod) => {
        return prod.productId == productID
    })
    let updatedCartItems = [...this.cart.items]
    let itemQuantity = 1
    if(itemIndex >= 0){
        updatedCartItems[itemIndex].quantity += itemQuantity
        this.cart.items = updatedCartItems
    }
    else{
        updatedCartItems.push({productId: productID, quantity:itemQuantity})
        this.cart.items = updatedCartItems
    }
    return this.save()
}

userSchema.methods.deleteFromCart = function(productID){
    let updatedCart = this.cart.items.filter((item) => {
        return item.productId.toString() !== productID.toString()
    })
    this.cart.items = updatedCart
    return this.save()
}

module.exports = mongoose.model('User', userSchema)