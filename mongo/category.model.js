const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    category_code: { type: Number, unique: true } // Mã danh mục duy nhất
});

module.exports = mongoose.models.Category || mongoose.model('category', categorySchema);
