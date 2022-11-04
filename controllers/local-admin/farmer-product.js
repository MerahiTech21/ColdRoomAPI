const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const farmerProduct =db.farmerProduct;
const {AddFarmer} = require("./farmer");
const { fn } = require("sequelize");
const coldRoomProduct = db.coldRoomProduct;

const SaveFarmerProduct = async (req, res) => {
    // res.json(req.body.farmer)
  try {
    
  let farmerId;
  if (req.body.newFarmer) {
    farmerId = await AddFarmer(req.body.farmer);
    console.log('farmerId',farmerId)
  } else {
    farmerId = req.body.farmerId;
  }
 
 
  const dataToSave = {
    coldRoomId: req.body.coldRoomId,
    ProductTypeId: req.body.productTypeId, 
    productId: req.body.productId,
    farmerId: farmerId,
    oldQuantity: req.body.quantity,
    soldQuantity: 0,
    currentQuantity:req.body.quantity ,
    quality: req.body.quality,
    warehousePosition: req.body.warehousePosition, 
  };

  const fp=await farmerProduct.create(dataToSave);
  //farmer.addProductType(product, { through: { dataToSave } });

  //console.log(fp.stringfy())
  res.json('saved')
} catch (error) {
  res.json(''+error)

  //  console.log('error',error)
}
};

const getFarmerProduct =async(req,res)=>{
  const fp=await farmerProduct.findAll({
   attributes:['productId',[db.sequelize.fn('sum',db.sequelize.col('oldQuantity')),'totalProduct'],   
 ],
 include:[{
   model:db.product ,
   attributes:['name','imageUrl']
 }],
   group:['productId'],
  
  });
  res.json(fp) 
}

const getProductDetail =async(req,res)=>{
  const fp=await farmerProduct.findAll({
    attributes:['productId'],
 include:[,{
  model:db.farmer ,
   attributes:['fName','lName']
},{
  model:db.productType ,
   attributes:['name','imageUrl']
}
],
  //  group:['createdAt'],
  
  });
  res.json(fp) 
}

// const ProductDetail = async (req, res) => {
//   let productId = req.params.id;
//   const farmerProducts = Farmer.findAll({
//     include: {
//       model: product,
//       where: { id: productId },
//       include: productType,
//     },
//   });
//   const dataToSend=farmerProducts.map((farmer)=>{
//     const data ={
//         farmerName:farmer.fName + farmer.lName
//     }
//     data.products=farmer.products.map((product)=>{
//          const prod = {
//             productSku:product.name
//           }
//           prod.typs=product.productTypes.map((pType)={
//             return {
                
//             }
//           })
//     })
//   })
// };
module.exports={SaveFarmerProduct,getFarmerProduct,getProductDetail}