// Thực hiện thao tác CRUD với collection categories
const productsModel = require('./product.model')
const categoryModel = require('./category.model')
module.exports = {getProduct,getProductByName, getDetailPro, addPro, updatepro, deletepro, getProCate, getLowStockProducts, getPaginatedProducts, getTotalProductCount, getSortedProductsByPrice}
// Lấy toàn bộ dữ liệu
async function getProduct(){
    try {
        // lấy theo số lượng dữ liệu            đây là giới hạn số lượng dữ liệu 
        const pros = await productsModel.find().limit(10).sort({_id: -1})
        // lấy fiek name, price, img
        // select name, price, imgae from products where
                        // ngoặc nhọn đầu tiên sẽ lấy điều kiện, nhọn thứ 2 là where
        const pros1 = await productsModel.find({
            // $gt là toán tử lớn hơn  $lt là toán tử nhỏ hơn $gte lớn hơn hoặc bằng $lte là nhỏ hơn hoặc bằng 
            price:{$gt: 350000}
        },{name: 1, price: 1, img:1})
        // select name, price, img, from products where price > 40000 adn
        const pros2 = await productsModel.find({
            $and:[
                {price:{$gt: 350000}}
            ]
        })
        // or[] tìm kiếm theo key 
        // select * from products where name like 
       
        const products = await productsModel.find({});
        return products
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi lất dữ liệu danh mục')
    }
}
async function getProductByName(name) {
    try {
        const products = await productsModel.find({ name: { $regex: name, $options: "i" } });
        return products;
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi tìm kiếm sản phẩm theo tên');
    }
}




// lấy dữ liệu theo id
async function getDetailPro(id) {
    try {
        const result = await productsModel.findById(id)
        return result
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi lấy dữ liệu sản phẩm')
        
    }
}
// http://localhost:3000/product/category/cate_id
async function getProCate(cate_id) {
    try {
        // Kiểm tra danh mục có tồn tại không
        const categoryFind = await categoryModel.findById(cate_id);
        if (!categoryFind) {
            throw new Error('Danh mục không tồn tại');
        }
        // Tìm tất cả sản phẩm thuộc danh mục này
        const products = await productsModel.find({ "cate_id.categoryId": cate_id });

        return products;
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi lấy sản phẩm theo danh mục');
    }
}


async function addPro(data) {
    try {
        const{name, img, price, cate_id, quantity} = data
        console.log(data);
        const categoryFind = await categoryModel.findById(cate_id)
        if(!categoryFind){
            throw new Error('Danh mục không tồn tại')
        }
        // tạo document mới
        const newPro = new productsModel({
            name, img, price,quantity,
            cate_id:{
                categoryId: categoryFind._id,
                categoryName: categoryFind.name
            }
        })
        // lưu db
        const result = await newPro.save()
        return result;  
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi thêm dữ liệu sản phẩm')
    }
}

async function updatepro(id, data) {
    try {
        const pro = await productsModel.findById(id);
        if (!pro) {
            throw new Error('Sản phẩm không tồn tại');
        }
        const { name, img, price, cate_id, quantity } = data;
        let categoryFind = null;
        if (cate_id) {
            categoryFind = await categoryModel.findById(cate_id);
        }
        let categoryUpdate = categoryFind
            ? {
                  categoryId: categoryFind._id,
                  categoryName: categoryFind.name
              }
            : pro.category;
        const imageToUpdate = img || pro.img;
        const result = await productsModel.findByIdAndUpdate(
            id,
            { name, img: imageToUpdate, price, cate_id: categoryUpdate, quantity },
            { new: true } // Trả về sản phẩm đã được cập nhật
        );
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi cập nhật sản phẩm');
    }
}


async function deletepro(id){
    try {
        const result = await productsModel.findByIdAndDelete(id)
        return result
    } catch (error) {
        console.log(error);
    }
}
async function getLowStockProducts(req, res) {
    try {
      const lowStockProducts = await productsModel.find({ quantity: { $lt: 50 } });
  
      if (lowStockProducts.length === 0) {
        return res.status(404).json({ message: 'Không có sản phẩm nào còn ít hàng' });
      }
  
      res.json(lowStockProducts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Lỗi lấy sản phẩm còn ít hàng' });
    }
  }
  async function getPaginatedProducts(skip, limit) {
    try {
        const products = await productsModel.find().skip(skip).limit(limit);
        return products;
    } catch (error) {
        console.log('Lỗi lấy sản phẩm phân trang:', error);
        throw new Error('Lỗi lấy sản phẩm phân trang');
    }
}

// Đếm tổng số sản phẩm
async function getTotalProductCount() {
    try {
        const total = await productsModel.countDocuments();
        return total;
    } catch (error) {
        console.log('Lỗi đếm số lượng sản phẩm:', error);
        throw new Error('Lỗi đếm số lượng sản phẩm');
    }
}
// Hàm lấy danh sách sản phẩm sắp xếp theo giá tăng dần và giới hạn số lượng
async function getSortedProductsByPrice(limit) {
    try {
        const products = await productsModel.find().sort({ price: 1 }).limit(limit);
        return products;
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi lấy sản phẩm sắp xếp theo giá tăng dần');
    }
}