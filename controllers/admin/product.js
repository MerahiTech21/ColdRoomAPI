const { request } = require('express');
const db=require('../../config/database.js');
const multer=require('multer');
const path=require('path');
const Product=db.product;



//add product
const create= async(req,res)=>{
    let info={
        name:req.body.name,
        imageUrl:req.file.imageUrl,   
    };

    try{
        let product1= await Product.create(info);
        res.status(200).send(product1);

    } catch(err){
        console.log('error db creation');
    };
};

//uploading immage

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./Image');
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g,'-')+ path.extname(file.originalname));
    }
});

const upload=multer({
    storage:storage,
    limits:{fieldNameSize:'5000000'},
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




