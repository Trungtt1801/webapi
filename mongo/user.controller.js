// Thực hiện thao tác CRUD với collection categories
const userModel = require('./user.model')
const bcryptjs = require('bcryptjs'); // Đảm bảo dùng đúng thư viện
module.exports = {resign, getUser, login}

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
      let { name, email, phone, password, role } = data;
  
      if (!name || !email || !phone || !password) {
        throw new Error("Thiếu thông tin bắt buộc");
      }
  
      email = email.toLowerCase(); // ✅ chuẩn hóa email
  
      // Kiểm tra email đã tồn tại chưa
      let user = await userModel.findOne({ email });
      if (user) {
        throw new Error("Email đã tồn tại");
      }
  
      const salt = await bcryptjs.genSalt(10);
      const hashpassword = await bcryptjs.hash(password, salt);
  
      user = new userModel({
        name,
        email, // đã chuẩn hóa
        phone,
        password: hashpassword,
        role,
      });
  
      const result = await user.save();
      if (!result) {
        throw new Error("Không thể lưu người dùng");
      }
  
      return { status: true, message: "Tạo tài khoản thành công", user: result };
  
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Lỗi trong quá trình tạo tài khoản");
    }
  }
  

  async function login(data) {
    try {
      let { email, password } = data;
  
      if (!email) {
        throw new Error("Email không được để trống");
      }
      if (!password) {
        throw new Error("Mật khẩu không được để trống");
      }
      
      // Chuẩn hóa chữ thường
      email = email.toLowerCase();
  
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error("Email chưa được đăng ký!!");
      }
  
      const checkpass = bcryptjs.compareSync(password, user.password);
      if (!checkpass) {
        throw new Error("Sai mật khẩu!!");
      }
  
      const plainUser = user.toObject();
      delete plainUser.password;
      return plainUser;
  
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Lỗi đăng nhập");
    }
  }
  