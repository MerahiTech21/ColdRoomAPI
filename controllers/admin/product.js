const { request } = require('express');
const {db}=require('../../config/database.js');
const multer=require('multer');
const path=require('path');
const { nextTick } = require('process');
const Product=db.product;

//add product
const create= async(req,res)=>{
    
    console.log(req.file);
   // res.send('done');
    let productInfo={
        name:req.body.name,
        imageUrl:req.file.path,
           
    };
   

    try{
        let product1= await Product.create(productInfo);
        if(product1){
             
        }

        res.status(200).send(product1);

    } catch(err){
        console.log('error db creation',err);
    };
};

//uploading immage
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'Images');
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g,'-')+ path.extname(file.originalname));
    }
});
const upload=multer({
    storage:storage,
    limits:{fieldNameSize:'50000000'},
    fileFilter:(req,file,cb)=>{
        const fileType=/jpeg|jpg|png|gif/
        const mimeType=fileType.test(file.mimetype)
        const extname=fileType.test(path.extname(file.originalname));
        if(mimeType && extname){
            return cb(null,true);
        }
        cb('give proper files format to upload');
    }
}).single('imageUrl');

module.exports={
    upload,
    create,
    
};




