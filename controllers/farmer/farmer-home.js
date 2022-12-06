const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const farmer = require("../../models/farmer");
const { Op } = require("sequelize");
const { all } = require("../../routes/farmer");
const productType = require("../../models/productType");
const Product = db.product;
const ProductType = db.productType;
const FarmerProduct = db.farmerProduct;
const FarmerBalance = db.FarmerBalance;
const FarmerRent = db.FarmerRent;
//const FarmRent=db.FarmerRent

const getData = async (req, res) => {
  let FarmerProductAmount = 0;
  let FarmerTotalBalance = 0;
  let farmerHomeData = [];
  try {
    let FProduct = await FarmerProduct.findAll({
      where: { farmerId: req.params.id },
    });
    //res.json(FProduct)
    FProduct.forEach((product) => {
      FarmerProductAmount = FarmerProductAmount + product.currentQuantity;
    });
    // res.json(FarmerProductAmount);
    let FBalance = await FarmerBalance.findAll({
      where: {
        farmerId: req.params.id,
      },
    });
    FBalance.forEach((FarBalance) => {
      FarmerTotalBalance = FarmerTotalBalance + FarBalance.balanceAmount;
    });
    //res.json(FarmerProductAmount);
    farmerHomeData = {
      farmerBalance: FarmerTotalBalance,
      farmerProduct: FarmerProductAmount,
    };
    res.json(farmerHomeData);
  } catch (err) {}
};
/**
 * return all products associated with a certain farmer

 */

const getFarmerProduct = async (req, res) => {
  try {
    let allP = [];
    let FProducts = await FarmerProduct.findAll({
      where: {
        farmerId: req.params.id,
      },
      include: [
        {
          model: Product,
        },
        {
          model: ProductType,
        },
      ],
    });
    for (let farmerProduct of FProducts) {
      // let rent=await FarmerRent.findOne({where:{farmerProductId:farmerProduct.id}});
      // let rentAmount=rent ? rent.rentAmount : 0;

      let product = {
        id: farmerProduct.product.id,
        name: farmerProduct.product.name,
        image: farmerProduct.product.imageUrl,
        remainingQuantity: farmerProduct.currentQuantity,
        createdAt: farmerProduct.createdAt, 
      };
      allP.push(product);
    }
    res.json(allP);
  } catch (err) {
    res.status(400).json("Error " + err);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
const getProductType = async (req, res) => {
  //res.json(req.body);
  let allProdType = [];
  try {
    let id = req.body.productId;
    const ProdTypes = await FarmerProduct.findAll({
      where: {
        farmerId: req.params.id,
        productId: id,
      },
      include: [
        {
          model: ProductType,
        },
      ],
    });
    //res.json(ProdTypes);
    for (PTypes of ProdTypes) {
      // res.json(PTypes)
      let ProddType = {
        name: PTypes.productType.title,
        remainingQuantity: PTypes.currentQuantity,
        soldQuantity: PTypes.soldQuantity,
        addedDate: PTypes.createdAt,
        image: PTypes.productType.imageUrl,
      };

      allProdType.push(ProddType);
    }
    res.json(allProdType);
  } catch (err) {
    res.json(err);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */

const getSoldProduct = async (req, res) => {
  const allSold = [];
  try {
    //   res.json("hii");
    let SProduct = await FarmerProduct.findAll({
      where: {
        farmerId: req.params.id,
        soldQuantity: {
          [Op.gt]: 0,
        },
      },
      include: [
        {
          model: Product,
        },
        {
          model: ProductType,
        },
        {
          model: FarmerBalance,
        },
      ],
    });
    //res.json(SProduct);
   let sp=SProduct;
    for (let i=0;i<sp.length ;i++) {
      // let p=Product.findAll()
      //res.json(sp.product.name);
      let farmerBal = await FarmerBalance.findOne({
        where: { farmerProductId: sp[i].id },
      });
     // res.json(farmerBal)
      if(farmerBal===null ){
          continue;
      }

      let rent = await FarmerRent.findOne({
        where: { farmerProductId: sp[i].id },
      });
      //res.json(rent)
     
      let rentAmount;
      let balance;
      if (rent === null) {
        rentAmount = 0;
      } else {
        rentAmount = rent.rentAmount;
      }
      if (farmerBal === null) {
        balance = 0;
      } else {
        balance = farmerBal.balanceAmount;
      }
      

      let netBal = balance - rentAmount;
      let products = {
        productName: sp[i].product.name,
        typeName: sp[i].productType.title,
        quality: sp[i].quality,
        image: sp[i].product.imageUrl,
        soldAmount: sp[i].soldQuantity,
        soldPrice: sp[i].soldQuantity * sp.pricePerKg,
        rentCost: rentAmount,
        date: sp.updatedAt,
        netBalance: netBal,
      };

      const totalBalance= sp[i].farmerBalances.reduce((sum, balance) => {
        return sum + balance.balanceAmount;
      }, 0.0)
      const rentCost= sp[i].farmerBalances.reduce((sum, balance) => {
        return sum + balance.rentAmount;
      }, 0.0)

      let newproducts = {
        productName: sp[i].product.name,
        typeName: sp[i].productType.title,
        quality: sp[i].quality,
        image: sp[i].product.imageUrl,
        soldAmount: sp[i].soldQuantity,
        totalBalance: totalBalance,
        rentCost: rentCost,
        date: sp[i].updatedAt,
        netBalance: totalBalance-rentCost,
      };

      //console.log(products);
     // res.json(newproducts);
      //return;
      allSold.push(newproducts);
    }
    //    let all=[];
    //    all.push(allSold);
    //console.log(allSold);
    //console.log(allSold);

    res.status(200).json(allSold);

    //res.json(allSold);
  } catch (err) {
    res.status(200).json("Error " + err);
  }
};

const getWithDraw = async (req, res) => {
  try {
    const withDrawAmount = await FarmerBalance.findAll({
      where: { farmerId: req.params.id, state: 1 },
      attributes: ["id", "balanceAmount", "updatedAt"],
      order: [["updatedAt", "DESC"]],
    });

    res.json(withDrawAmount);
  } catch (err) {
    res.status(400).json('Error '+err)
  }
};
module.exports = {
  getData,
  getFarmerProduct,
  getSoldProduct,
  getWithDraw,
  getProductType,
};
