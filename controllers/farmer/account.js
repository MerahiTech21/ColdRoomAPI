const { db } = require("../../config/database");
const bcrypt = require("bcrypt");

const Farmer = db.farmer;
const Address = db.address;

const create = async (req, res) => {
  var userInfo = {
    fName: req.body.fName,
    lName: req.body.lName,
    phoneNumber: req.body.phoneNumber,
    sex: req.body.sex,
  };

  try {
    // Validate if user exist in our database

    const oldFarmer = await Farmer.findOne({
      where: { phoneNumber: userInfo.phoneNumber },
    });

    if (oldFarmer) {
      return res.status(409).json("User Already Exist. Please Login");
    }

    let encryptedPassword = await bcrypt.hash(req.body.password, 10);

    //calling function
    let addressId = await createAddress(req.body.address);

    userInfo.password = encryptedPassword;
    userInfo.addressId = addressId;
    let farmer = await Farmer.create(userInfo);
    let address = await farmer.getAddress();
    res.status(200).json({ farmer, address });
    console.log("farmer", JSON.stringify(farmer));
  } catch (err) {
    console.log("Error while creating farmer" + err);
    res.status(408).json({ success: false, message: err.msg });
  }
};

const createAddress = async (address) => {
  const newaddress = await Address.create(address);
  return newaddress.id;
};

const getAccount = async (req, res) => {
  let id = req.params.id;
  let farmer = await Farmer.findOne({
    where: { id: id },
    attributes: { exclude: ["addressId", "password"] },
    include: "address",
  });
  if (!farmer) {
    res.status(404).json("Farmer Not FOund");
  }
  res.status(200).json(farmer);
  console.log(farmer);
};

//update user

const update = async (req, res) => {
  let id = req.params.id;
  let farmer = await Farmer.update(req.body, { where: { id: id } });

  //res.json(farmer);
  if (farmer == 1) {
    res
      .status(200)
      .json(
        await Farmer.findOne({
          where: { id: id },
          attributes: { exclude: ["addressId", "password"] },
          include: "address",
        })
      );
  }
};

module.exports = {
  create,
  getAccount,
  update,
};
