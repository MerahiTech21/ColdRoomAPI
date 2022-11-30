const { response } = require("express");
const { db } = require("../../config/database");
const ColdRoomProduct = db.coldRoomProduct;

const getProductTypePrice = async (req, res) => {
try {
  const crpp = await ColdRoomProduct.findAll({
    where: { productId: req.params.id },
    include: [
      {
        model:db.productType,
        required:false,
        right:true
      },
    ],
  });

  const pro=await db.productType.findAll({where:{productId:req.params.id},include:ColdRoomProduct})

  res.json(pro)
 
} catch (error) {
  res.status(400).json('Error '+error)
}
}
const setProductTypePrice = async (req, res) => {
  try {
    const foundedProduct = ColdRoomProduct.findOne({
      where: {
        productTypeId: req.body.productTypeId,
        coldRoomId: req.body.coldRoomId,
      },
    });

    if (!foundedProduct) {
      const cRoomPrice = ColdRoomProduct.create({
        productTypeId: req.body.productTypeId,
        coldRoomId: req.body.coldRoomId,
        price: req.body.price,
      });
      res.status(201).json("successfully created");
    }
    foundedProduct.price = req.body.price;
    await foundedProduct.save();
    res.status(201).json("successfully created");
  } catch (error) {
    res.status(400).json("Error While setting Price");
  }
};

module.exports={getProductTypePrice,setProductTypePrice}