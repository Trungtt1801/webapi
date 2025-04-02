// http://localhost:3000/users/
var express = require('express');
var router = express.Router();
const userController = require('../mongo/user.controller')

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
router.post("/adduser", async(req, res) =>{
try {
    const data = req.body
    const result = await userController.resign(data)
    return res.status(200).json({status: true, result})
} catch (error) {
    console.log(error);
    return res.status(500).json({status: false, message:"Lỗi thêm dữ liệu user"})
}
})


// http://localhost:3000/users/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userController.login({email, password});        
        if (!user) {
            return res.status(401).json({ status: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
        return res.status(200).json({ status: true, message: 'Đăng nhập thành công', user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Lỗi đăng nhập' });
    }
});

module.exports = router;
