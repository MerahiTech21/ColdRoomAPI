const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const FarmerProduct = db.farmerProduct;
const { AddFarmer } = require("./farmer");
const { fn } = require("sequelize");
const ColdRoomProduct = db.coldRoomProduct;

const SaveFarmerProduct = async (req, res) => {
  // res.json(req.body.farmer)
  try {
    let farmerId;
    if (req.body.isNew) {
      farmerId = await AddFarmer(req.body.farmer);
      console.log("farmerId", farmerId);
    } else {
      farmerId = req.body.farmerId;
    }

    const dataToSave = {
      coldRoomId: req.body.coldRoomId,
      productTypeId: req.body.product.productTypeId,
      productId: req.body.product.productId,
      farmerId: farmerId,
      oldQuantity: req.body.product.quantity,
      soldQuantity: 0,
      currentQuantity: req.body.product.quantity,
      quality: req.body.product.quality,
      pricePerKg: 123,
      warehousePosition: req.body.product.warehousePosition,
    };
    const fp = await FarmerProduct.create(dataToSave);
    res.json("saved");
  } catch (error) {
    res.json("" + error);

    //  console.log('error',error)
  }
};
const editFarmerProduct = async (req, res) => {
  try {
    const fproduct=await FarmerProduct.findOne({where:{id:req.params.id}})
    if(fproduct && fproduct.soldQuantity){
      res.status(403).json('Unnable to edit Sold Product')
      return
    }
    const dataToSave = {
      coldRoomId: req.body.coldRoomId,
      productTypeId: req.body.productTypeId,
      productId: req.body.productId,
      farmerId: req.body.farmerId,
      oldQuantity: req.body.quantity,
      soldQuantity: 0,
      currentQuantity: req.body.quantity,
      quality: req.body.quality,
      pricePerKg: 123,
      warehousePosition: req.body.warehousePosition,
    };
    const fp = await FarmerProduct.update(dataToSave,{ where: { id: req.params.id } }
      
    );
    res.json("Updated Succcessfuly");
  } catch (error) {
    res.status(400).json("" + error);

    //  console.log('error',error)
  }
};
const deleteFarmerProduct = async (req, res) => {
  try {
    const fproduct=await FarmerProduct.findOne({where:{id:req.params.id}})
    if(fproduct && fproduct.soldQuantity){
      res.status(403).json('Unnable to Delete Sold Product')
      return
    }
    const fp = await fproduct.destroy()
    res.json("Deleted Succcessfuly");
  } catch (error) {
    res.json("Error " + error);
  }
};

const getFarmersProducts = async (req, res) => {
  try {
    const coldRoomId = req.query.coldRoomId;
    console.log("cli", coldRoomId);
    if (!coldRoomId) {
      res.status(404).json("Error No coldrrom ");
      return;
    }
    const fp = await FarmerProduct.findAll({
      where: { coldRoomId: coldRoomId },
      attributes: [
        "productId",
        [
          db.sequelize.fn("sum", db.sequelize.col("oldQuantity")),
          "totalProduct",
        ],
      ],
      include: [
        {
          model: db.product,
          attributes: ["name", "imageUrl"],
        },
      ],
      group: ["productId"],
    });
    res.json(fp);
  } catch (error) {
    res.status(404).json("Error " + error);
  }
};

const getProductDetail = async (req, res) => {
  try {
    const fp = await FarmerProduct.findAll({
      //attributes:['productId'],
      where: { productId: req.params.id },
      include: [
        {
          model: db.farmer,
          attributes: ["id", "fName", "lName"],
        },
        {
          model: db.productType,
          attributes: ["id", "title", "imageUrl"],
        },
      ],
      //  group:['createdAt'],
    });
    res.json(fp);
  } catch (error) {
    console.log("Error " + error);
  }
};
const getAllFarmerProduct = async (req, res) => {
  try {
    const fp = await FarmerProduct.findAll({
      //attributes:['productId'],
      //  where:{productId:req.params.id},
      include: [
        {
          model: db.farmer,
          attributes: ["id", "fName", "lName"],
        },
        {
          model: db.productType,
          attributes: ["id", "title", "imageUrl"],
        },
        {
          model: db.product,
          attributes: ["id", "name", "imageUrl"],
        },
      ],
      //  group:['createdAt'],
    });
    res.json(fp);
  } catch (error) {
    console.log("Error " + error);
    res.status(404).json("Error " + error);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await db.product.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: db.productType,
          attributes: ["id", "title"],
        },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json("Error " + error);
  }
};

module.exports = {
  SaveFarmerProduct,
  getFarmersProducts,
  getProductDetail,
  getProducts,
  deleteFarmerProduct,
  getAllFarmerProduct,
  editFarmerProduct,
};
