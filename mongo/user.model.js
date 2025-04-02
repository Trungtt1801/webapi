// kết nối  tạo collection categories
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    role: {type: Number, require: true, default: 0},
    phone:{type: Number, required: false},
    address:{type: String, required: false}
})

module.exports = mongoose.models.user || 
mongoose.model('users', userSchema);