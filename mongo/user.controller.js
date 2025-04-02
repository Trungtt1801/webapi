// Thực hiện thao tác CRUD với collection categories
const userModel = require('./user.model')
const userController = require('./category.controller');
const bcrytpjs = require('bcryptjs')
module.exports = {resign,getUser,   login}

async function getUser(){
    try {
        // lấy theo số lượng dữ liệu            đây là giới hạn số lượng dữ liệu 
        const pros = await userModel.find().limit(10).sort({_id: -1})
        // lấy fiek name, price, img
        // select name, price, imgae from products where
                        // ngoặc nhọn đầu tiên sẽ lấy điều kiện, nhọn thứ 2 là where
        const pros1 = await userModel.find({
            // $gt là toán tử lớn hơn  $lt là toán tử nhỏ hơn $gte lớn hơn hoặc bằng $lte là nhỏ hơn hoặc bằng 
            price:{$gt: 350000}
        },{name: 1, price: 1, img:1})
        // select name, price, img, from products where price > 40000 adn
        const pros2 = await userModel.find({
            $and:[
                {price:{$gt: 350000}}
            ]
        })
        // or[] tìm kiếm theo key 
        // select * from products where name like 
        const pros3 = await userModel.find({
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
// Đăng kí

async function resign(data) {
    try {
        const {name, email, phone, password, role} = data
        // Kiểm tra emal có tồn tại hay ko 
        let user = await userModel.findOne({email: email})
        if(user){
            throw new Error("email đã tồn tại")
        }
        const salt = bcrytpjs.genSaltSync(10);
        const hashpassword = bcrytpjs.hashSync(password, salt);
// Store hash in your password DB
        user = new userModel({name, email, phone , password: hashpassword, role})
        const result = await user.save()
        return result;
    } catch (error) {
        console.log(error);
        throw new Error("Loi")
    }
}
async function login(data) {
    try {
        const {email, password} = data;
        let user = await userModel.findOne({email: email})
        if(!user){
            throw new Error('Email chưa được đăng ký!!')
        }
        // kiểm tra password
        let checkpass = bcrytpjs.compareSync(password, user.password)
        if(!checkpass){
            throw new Error('Sai mật khẩu!!')
        }
        // user.doc
        delete user._doc.password
        user = {...user._doc}
        return user
        // token -> key secret => .env
    } catch (error) {
        console.log(error);
    }
}
