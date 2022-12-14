const  ProductController=require('../../controllers/admin/product.js');
const router=require('express').Router();
const UploadImage=require('../../middelware/file-upload-multer/product-image-upload')
 router.post('/',UploadImage,ProductController.create);
 router.get('/',ProductController.getAll)
 router.get('/:id',ProductController.getProductType)
 router.put('/:id',UploadImage,ProductController.update)
 router.delete('/:id',ProductController.destroy)

 module.exports = router;

 