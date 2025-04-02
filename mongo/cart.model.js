const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    
})

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);