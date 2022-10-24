const { request } = require('express');
const db=require('../../config/database.js');

const Product=db.product;

const create=async((req,res)=>{
    let info={
        name:req.body.name,
        imageUrl:req.body.imageUrl,

        product.create(info),

    },
    try{

    }catch(err){

    };

});


