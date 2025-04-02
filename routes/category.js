// http://localhost:3000/category/
var express = require('express');
var router = express.Router();
const categoryController = require('../mongo/category.controller')

// Lấy toàn bộ dữ liệu
// http://localhost:3000/category/
router.get('/', async(req,res) =>{
    try {
        const result = await categoryController.getAllCate()
        return res.status(200).json({status: true, result})
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: 'Lỗi lấy dữ liệu lấy danh mục'})
    }
})
// http://localhost:3000/category/quan-ao-nam/product

router.get('/:category_code/product', async (req, res) => {
    try {
        const { category_code } = req.params;
        const products = await categoryController.getProductsByCategoryCode(Number(category_code));

        if (!products || products.length === 0) {
            return res.status(404).json({ status: false, message: "Không có sản phẩm nào trong danh mục này" });
        }

        return res.status(200).json({ status: true, result: products });
    } catch (error) {
        console.error("Lỗi lấy sản phẩm theo category_code:", error);
        return res.status(500).json({ status: false, message: "Lỗi server" });
    }
});





// http://localhost:3000/category/addcate
router.post("/addcate", async(req, res) =>{
try {
    const data = req.body
    const result = await categoryController.addCate(data)
    return res.status(200).json({status: true, result})
} catch (error) {
    console.log(error);
    return res.status(500).json({status: false, message:"Lỗi thêm dữ liệu sản phẩm"})
}
})
// http://localhost:3000/category/deletecate/:id
router.delete('/deletecate/:id', async(req, res) =>{
    try {
        const {id} = req.params
        const result = await categoryController.deleteCate(id)
        return res.status(200).json({status: true, message:'Xóa thành công'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message:"Lỗi xóa ko thành công"})
    }
})
module.exports = router;
