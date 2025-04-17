// http://localhost:3000/users/
var express = require('express');
var router = express.Router();
const userController = require('../mongo/user.controller')
require('dotenv').config({ path: './token.env' }); 
const jwt = require('jsonwebtoken');

// Lấy toàn bộ dữ liệu
//  http://localhost:3000/users/
router.get('/', async(req,res) =>{
    try {
        const result = await userController.getUser()
        return res.status(200).json({status: true, result})
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: 'Lỗi lấy dữ liệu lấy danh mục'})
    }
})
//  http://localhost:3000/users/adduser
router.post("/adduser", async (req, res) => {
    try {
        const data = req.body;
        const result = await userController.resign(data);

        // Nếu tạo tài khoản thành công
        return res.status(200).json({ status: true, message: result.message, user: result.user });

    } catch (error) {
        // Nếu có lỗi từ backend
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
});


// http://localhost:3000/users/login
// http://localhost:3000/users/login
router.post('/login', async (req, res) => {
  try {
    console.log('Body nhận được:', req.body);
    const { email, password } = req.body;
    const user = await userController.login({ email, password });

    if (!user) {
      return res.status(401).json({ status: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    // Nếu là admin → tạo token
    if (user.role === 1) {
      const token = jwt.sign(
        { email: user.email, role: user.role },
        process.env.PRIVATE_KEY,
        { expiresIn: '1h', subject: user._id.toString() }
      );

      return res.status(200).json({ 
        status: true, 
        message: 'Đăng nhập thành công với quyền admin', 
        token, 
        user 
      });
    }

    // Nếu không phải admin → login không có token
    return res.status(200).json({
      status: true,
      message: 'Đăng nhập thành công (không phải admin)',
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message || 'Lỗi đăng nhập' });
  }
});



module.exports = router;
