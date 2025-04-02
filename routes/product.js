// http://localhost:3000/product/
var express = require('express');
var router = express.Router();
const productController = require('../mongo/product.controller');
const multer = require('multer');
const categoryModel = require('../mongo/category.model');
const productsModel = require('../mongo/product.model'); 
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})
const checkfile = (req, file, cb)=>{
    if(!file.originalname.match(/\.(jpg| jpeg |gif |webp| png)$/)){
        return cb(new Error("Bạn chỉ được upload file ảnh"))
    }
    return cb(null, true)
}
const upload = multer({storage: storage})
// Lấy toàn bộ dữ liệu
// http://localhost:3000/product/
router.get("/", async (req, res) => {
    try {
        const result = await productController.getProduct();
        const baseUrl = "http://localhost:3000/images/"; // Đổi đường dẫn nếu cần

        const updatedProducts = result.map((product) => ({
            ...product._doc,
            img: product.img.startsWith("http") ? product.img : baseUrl + product.img
        }));

        return res.status(200).json({ status: true, result: updatedProducts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu sản phẩm" });
    }
});

router.get("/uploads/:filename", async (req, res) => {
    try {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "uploads",
        });

        bucket.openDownloadStreamByName(req.params.filename).pipe(res);
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi khi tải ảnh", error });
    }
});
// Route tìm kiếm sản phẩm
// Lấy sản phẩm theo tên
// http://localhost:3000/product/search?name=áo
router.get("/search", async (req, res) => {
    try {
        const { name } = req.query;
        console.log(name);
        if (!name) {
            return res.status(400).json({ status: false, message: "Thiếu tên sản phẩm" });
        }
        const result = await productController.getProductByName(name);
        const baseUrl = "http://localhost:3000/images/";

        const updatedProducts = result.map((product) => ({
            ...product._doc,
            img: product.img.startsWith("http") ? product.img : baseUrl + product.img
        }));

        return res.status(200).json({ status: true, result: updatedProducts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Lỗi lấy sản phẩm theo tên" });
    }
});

// http://localhost:3000/product/sort-price?limit=5
router.get('/sort-price', async (req, res) => {
    const { limit } = req.query;
    const limitInt = parseInt(limit) || 10;
    try {
        const results = await productController.getSortedProductsByPrice(limitInt);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi lấy sản phẩm sắp xếp theo giá tăng dần', 
            error: error.message 
        });
    }
});
// API: Lấy danh sách sản phẩm nổi bật
// http://localhost:3000/product/low-stock
router.get('/low-stock', async (req, res) => {
    try {
      const lowStockProducts = await productsModel.find({ quantity: { $lt: 10} });
  
      if (lowStockProducts.length === 0) {
        return res.status(404).json({ message: 'Không có sản phẩm nào còn ít hàng' });
      }
  
      res.json(lowStockProducts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Lỗi lấy sản phẩm còn ít hàng' });
    }
  });
//   http://localhost:3000/product/pagination
  router.get('/pagination', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await productController.getPaginatedProducts(skip, limit);
        const total = await productController.getTotalProductCount();

        res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            products
        });
    } catch (error) {
        console.error('Lỗi phân trang:', error);
        res.status(500).json({ message: 'Lỗi lấy sản phẩm phân trang' });
    }
});
// http://localhost:3000/product/id:
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await productController.getDetailPro(id);
        const baseUrl = "http://localhost:3000/images/"; // Đổi đường dẫn nếu cần

        // Kiểm tra và cập nhật đường dẫn ảnh
        const updatedProduct = {
            ...result._doc,
            img: result.img.startsWith("http") ? result.img : baseUrl + result.img
        };

        return res.status(200).json({ status: true, result: updatedProduct });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu sản phẩm" });
    }
});

// thêm sản phẩm
// http://localhost:3000/product/addpro
router.post("/addpro",upload.single('img'), async(req, res) =>{
    try {
        const data = req.body
        console.log(data);
        data.img = req.file.originalname
        const result = await productController.addPro(data)
        return res.status(200).json({status: true, result})
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message:"Lỗi thêm dữ liệu sản phẩm"})
    }
})
router.put('/updatepro/:id', upload.single('img'), async(req,res) =>{
    try {
        const {id} = req.params
        const data = req.body
        if(req.file){
            data.img = req.file.originalname
        }else{
            delete data.img
        }  
        const result = await productController.updatepro(id,data)
        return res.status(200).json({status: true, result})
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: 'Lỗi cập nhật sản phẩm'})
    }
})
// http://localhost:3000/product/category/:cate_id
router.get("/category/:cate_id", async (req, res) => {
    try {
        const { cate_id } = req.params;
        const result = await productController.getProCate(cate_id);
        const baseUrl = "http://localhost:3000/images/"; // Đường dẫn ảnh

        const updatedProducts = result.map((product) => ({
            ...product._doc,
            img: product.img.startsWith("http") ? product.img : baseUrl + product.img
        }));

        res.json({ success: true, result: updatedProducts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
});



router.delete('/deletepro/:id', async(req, res) =>{
    try {
        const {id} = req.params
        const result = await productController.deletepro(id)
        return res.status(200).json({status: true, message:'Xóa thành công'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message:"Lỗi xóa ko thành công"})
    }
})





module.exports = router;
