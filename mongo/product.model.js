// kết nối  tạo collection categories
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
    name: {type: String, require: true},
    img: {type: String, require: true},
    price: {type: Number, require: true},
    quantity: {type: Number, require: true},
    cate_id: {
        categoryId: {type: ObjectId, require: true},
        categoryName: {type: String, require: true}
    }
})
module.exports = mongoose.models.product || 
mongoose.model('products', productSchema);