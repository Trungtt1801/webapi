// Thực hiện thao tác CRUD với collection categories
const mongoose = require('mongoose'); 
const categoryModel = require('./category.model')
const categoriesModel = require('./category.model')
const productModel = require('./product.model')

module.exports = {getAllCate,addCate, deleteCate, getProductsByCategory, getProductsByCategoryCode}

// Lấy toàn bộ dữ liệu
async function getAllCate(){
    try {
        // lấy theo số lượng dữ liệu            đây là giới hạn số lượng dữ liệu 
        const pros = await categoriesModel.find().limit(10).sort({_id: -1})
        // lấy fiek name, price, img
        // select name, price, imgae from products where
                        // ngoặc nhọn đầu tiên sẽ lấy điều kiện, nhọn thứ 2 là where
        const pros1 = await categoriesModel.find({
            // $gt là toán tử lớn hơn  $lt là toán tử nhỏ hơn $gte lớn hơn hoặc bằng $lte là nhỏ hơn hoặc bằng 
            price:{$gt: 350000}
        },{name: 1, price: 1, img:1})
        // select name, price, img, from products where price > 40000 adn
        const pros2 = await categoriesModel.find({
            $and:[
                {price:{$gt: 350000}}
            ]
        })
        // or[] tìm kiếm theo key 
        // select * from products where name like 
        const pros3 = await categoriesModel.find({
            name:{
                $regex:'mo',
                $options: ''
            }
        })
        return pros
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi lất dữ liệu danh mục')
    }
}
// Hàm lấy sản phẩm theo danh mục
async function getProductsByCategory(cate_id) {
    try {
        console.log("cate_id nhận được từ API:", cate_id);

        // Kiểm tra nếu cate_id là ObjectId, nếu không thì giữ nguyên
        let convertedCateId;
        if (mongoose.Types.ObjectId.isValid(cate_id)) {
            convertedCateId = new mongoose.Types.ObjectId(cate_id);
        } else {
            convertedCateId = cate_id;
        }

        // Truy vấn MongoDB
        const products = await productModel.find({ "cate_id.categoryId": convertedCateId });

        console.log(" Sản phẩm lấy được:", products);

        if (!products || products.length === 0) {
            return { status: false, message: "Không có sản phẩm nào trong danh mục này" };
        }

        return { status: true, result: products };
    } catch (error) {
        console.error("Lỗi chi tiết:", error);

        return { status: false, message: "Lỗi khi lấy sản phẩm theo danh mục", errorDetail: error.message };
    }
}
async function getProductsByCategoryCode(category_code) {
    try {
        // Tìm danh mục theo category_code
        const category = await categoryModel.findOne({ category_code });

        if (!category) {
            throw new Error("Danh mục không tồn tại");
        }

        // Lấy sản phẩm theo category._id
        const products = await productModel.find({ categoryId: category._id });

        return products;
    } catch (error) {
        console.error("Lỗi lấy sản phẩm theo category_code:", error);
        throw error;
    }
}
async function addCate(data) {
    try {
        const { name, description } = data;

        // Kiểm tra danh mục đã tồn tại chưa
        const cateExists = await categoriesModel.findOne({ name });
        if (cateExists) {
            throw new Error('Danh mục đã tồn tại');
        }

        // Tạo document mới
        const newCate = new categoriesModel({ name, description });

        // Lưu vào DB
        const result = await newCate.save();

        return result; // Trả về kết quả nếu cần
    } catch (error) {
        console.error(error);
        throw new Error('Lỗi thêm danh mục');
    }
}
async function deleteCate(id){
    try {
        const result = await categoriesModel.findByIdAndDelete(id)
        return result
    } catch (error) {
        console.log(error);
    }
}
