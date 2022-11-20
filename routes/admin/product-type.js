const  ProductTypeController=require('../../controllers/admin/product-type');
const router=require('express').Router();
const UploadImage=require('../../middelware/file-upload-multer/product-image-upload')
 router.post('/',UploadImage,ProductTypeController.create);

 router.put('/:id',UploadImage,ProductTypeController.update)
 router.delete('/:id',ProductTypeController.destroy)

 module.exports = router;

 