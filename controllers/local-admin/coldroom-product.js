const { response } = require("express");
const { db } = require("../../config/database");
const ColdRoomProduct = db.coldRoomProduct;

const getProductTypePrice = async (req, res) => {
  try {
    const crpp = await ColdRoomProduct.findAll({
      where: { productId: req.params.id },
      include: [
        {
          model: db.productType,
          required: false,
          right: true,
        },
      ],
    });

    const pro = await db.productType.findAll({
      where: { productId: req.params.id },
      include: [
      {
         model:ColdRoomProduct,
         attributes:['id','price']
      }   
    
    ],
    });
   const newPrice=pro.map((proType)=>{
     return {
      id:proType.id,
      imageUrl:proType.imageUrl,
      title:proType.title,
      description:proType.description,
      productId:proType.productId, 
      price:proType.coldRoomProduct ?  proType.coldRoomProduct.price : 0
     }
   })
    res.json(newPrice);
  } catch (error) {
    res.status(400).json("Error " + error);
  }
};
const setProductTypePrice = async (req, res) => {
  try {
    const foundedProduct = await ColdRoomProduct.findOne({
      where: {
        productTypeId: req.body.productTypeId,
        coldRoomId: req.body.coldRoomId,
      },
    });

    if (!foundedProduct) {
      const cRoomPrice = await ColdRoomProduct.create({
        productTypeId: req.body.productTypeId,
        productId: req.body.productId,
        coldRoomId: req.body.coldRoomId,
        price: req.body.price,
      });
      res.status(200).json("successfully created");
      return;
    } else {
      foundedProduct.price = req.body.price;
      await foundedProduct.save();
    }

    res.status(200).json("successfully created");
  } catch (error) {
    res.status(400).json("Error While setting Price " + error);
  }
};

module.exports = { getProductTypePrice, setProductTypePrice };
