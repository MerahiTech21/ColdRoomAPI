const { db } = require("../../config/database");
const bcrypt = require("bcrypt");

const Farmer = db.farmer;
const Address = db.address;
const FarmerBalance = db.FarmerBalance;
const FarmerRent = db.FarmerRent;
const FarmerProduct = db.farmerProduct;
const Op = db.Sequelize.Op;

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

const editFarmer = async (req, res) => {
  var userInfo = {
    fName: req.body.fName,
    lName: req.body.lName,
    phoneNumber: req.body.phoneNumber,
  };

  var addressInfo = {
    id: req.body.addressId,
    region: req.body.region,
    zone: req.body.zone,
    woreda: req.body.woreda,
    kebele: req.body.kebele,
  };
  try {
    // Validate if user exist in our database

    const oldFarmer = await Farmer.findOne({
      where: { id: req.params.id },
    });

    if (!oldFarmer) {
      return res.status(404).json("User Not Exist.");
    }

    let encryptedPassword = await bcrypt.hash(userInfo.lName + "1234", 10);
     await Address.update(addressInfo, {
      where: { id: addressInfo.id },
    });

    userInfo.password = encryptedPassword;
    userInfo.addressId = addressInfo.id;
    await Farmer.update(userInfo, {
      where: { id: req.params.id },
    });
    const farmer = await Farmer.findOne({
      where: { id: req.params.id },
      include: { model:Address, as: "address" },
    });
    return res.json(farmer);
  } catch (err) {
    res.json("Error " + err);
  }
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
      order:[['createdAt','DESC']]

    });
    res.json(fp);
  } catch (error) {
    res.json(error);
  }
};

const getFarmers = async (req, res) => {
  try {
    const search = req.query.search;
    const coldRoomId=req.query.coldRoomId ? req.query.coldRoomId : null;

    var searchCondition = search
      ? {
          [Op.or]: [
            { fName: { [Op.like]: `%${search}%` } },
            { lName: { [Op.like]: `%${search}%` } },
          ],
        }
      : null;

    const farmers = await Farmer.findAll({
      where: searchCondition,
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
          where:{
            coldRoomId:coldRoomId
          }
        },
      ],
      //  group:['farmer.id','farmerBalances.farmerId','farmerRents.farmerId'],
      // raw:true
    });
    //console.log('far',farmers)

    const arrangedFarmers = farmers.map((farmer) => {
      return {
        id: farmer.id,
        fName: farmer.fName,
        lName: farmer.lName,
        address: farmer.address,
        phoneNumber: farmer.phoneNumber,
        totalProduct: farmer.farmerProducts.reduce((total, product) => {
          return total + product.oldQuantity;
        }, 0),
        totalBalance: farmer.farmerBalances.reduce((sum, balance) => {
          return sum + balance.balanceAmount;
        }, 0.0),
        totalRent: farmer.farmerBalances.reduce((sum, balance) => {
          return sum + balance.rentAmount;
        }, 0.0),
      };
    });
    res.json(arrangedFarmers);
  } catch (error) {
    res.json("" + error);
  }
};

const searchFarmer = async (req, res) => {
  const search = req.query.search;
  var searchCondition = search
    ? {
        [Op.or]: [
          { fName: { [Op.like]: `%${search}%` } },
          { lName: { [Op.like]: `%${search}%` } },
          { phoneNumber: { [Op.like]: `%${search}%` } },
        ],
      }
    : null;

    const coldRoomId=req.query.coldRoomId ? req.query.coldRoomId : null

  try {
    const farmers = await Farmer.findAll({
      where: searchCondition,
      attributes: ["id", "fName", "lName", "phoneNumber"],
      include: [
        {
          model: Address,
          as: "address",
          attributes: ["location"],
        },{
          model:FarmerProduct,
          where:{
            coldRoomId:coldRoomId
          }
        }
      ],
    });

    res.status(200).json(farmers);
  } catch (error) {
    res.status(404).json("Farmer Not Found" + error);
  }
};
module.exports = {
  AddFarmer,
  getFarmerProduct,
  getFarmers,
  searchFarmer,
  editFarmer,
};
