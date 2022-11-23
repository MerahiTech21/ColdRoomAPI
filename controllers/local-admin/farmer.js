const { db } = require("../../config/database");
const bcrypt = require("bcrypt");

const Farmer = db.farmer;
const Address = db.address;
const FarmerBalance = db.FarmerBalance;
const FarmerRent = db.FarmerRent;
const FarmerProduct = db.farmerProduct;
const Op=db.Sequelize.Op

const AddFarmer = async (farmerData) => {
  var userInfo = {
    fName: farmerData.fName,
    lName: farmerData.lName,
    phoneNumber: farmerData.phoneNumber,
    sex: farmerData.sex,
  };

  try {
    // Validate if user exist in our database

    const oldFarmer = await Farmer.findOne({
      where: { phoneNumber: userInfo.phoneNumber },
    });

    if (oldFarmer) {
      throw "User Already Exist. Please Login";
    }

    let encryptedPassword = await bcrypt.hash(farmerData.lName + "1234", 10);

    //calling function

    let addressId = await createAddress(farmerData.address);

    userInfo.password = encryptedPassword;
    userInfo.addressId = addressId;
    let farmer = await Farmer.create(userInfo);

    return farmer.id;
  } catch (err) {
    throw err;
  }
};

const createAddress = async (address) => { 
  const newaddress = await Address.create(address);
  return newaddress.id;
};

const getFarmerProduct = async (req, res) => {
  try {
    const fp = await FarmerProduct.findAll({
      where: { farmerId: req.params.id },
      //  attributes:['productId'],
      include: [
        {
          model: db.farmer,
          attributes: ["fName", "lName"],
        },
        {
          model: db.productType,
          attributes: ["title", "imageUrl"],
          include: [{ model: db.product, attributes: ["name"] }],
        },
      ],
      //  group:['createdAt'],
    });
    res.json(fp);
  } catch (error) {
    res.json(error);
  }
};

const getFarmers = async (req, res) => {
  try {

    const search=req.query.search

    var searchCondition = search ? { [Op.or]:[{fName: { [Op.like]: `%${search}%` }} ,{lName:{ [Op.like]: `%${search}%` }} ]} : null;

    const farmers = await Farmer.findAll({
      where:searchCondition,
      include: [
        {
          model: FarmerBalance,
        },
        {
          model: FarmerRent,
        },
        {
          model: Address,
          as: "address",
        },
        {
          model: FarmerProduct,
        },
      ],
      //  group:['farmer.id','farmerBalances.farmerId','farmerRents.farmerId'],
      // raw:true
    });
    //console.log('far',farmers)

    const arrangedFarmers = farmers.map((farmer) => {
      return {
        id: farmer.id,
        fullName: farmer.fName + " " + farmer.lName,
        location: farmer.address.woreda,
        totalProduct: farmer.farmerProducts.reduce((total, product) => {
          return total + product.oldQuantity;
        }, 0),
        totalBalance: farmer.farmerBalances.reduce((sum, balance) => {
          return sum + balance.balanceAmount;
        }, 0.0),
        totalRent: farmer.farmerRents.reduce((sum, rent) => {
          return sum + rent.rentAmount;
        }, 0.0),
      };
    });
    res.json(arrangedFarmers);
  } catch (error) {
    res.json("" + error);
  }
};

const searchFarmer=async(req,res)=>{

  const search=req.query.search
  var searchCondition = search ? {
      [Op.or]: [
        { fName: { [Op.like]: `%${search}%` } },
        { lName: { [Op.like]: `%${search}%` } },
        { phoneNumber: { [Op.like]: `%${search}%` } },
      ],
    }
  : null;
   try {
    const farmers=await Farmer.findAll({
      where:searchCondition,
      attributes:['id','fName','lName','phoneNumber'],
      include:[{
        model:Address,
        as:'address',
        attributes:['location']
      }]
    })

    res.status(200).json(farmers)
   } catch (error) {
    res.status(404).json('Farmer Not Found' +error)
   }
}
module.exports = { AddFarmer, getFarmerProduct, getFarmers,searchFarmer };
