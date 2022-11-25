const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken')
const WholeSaler = db.wholeSaler;
const Address = db.address;

const create = async (req, res) => { 
  res.json('hii');
  var userInfo = {
    fName: req.body.fName,
    lName: req.body.lName,
    phoneNumber: req.body.phoneNumber,
    sex: req.body.sex,
  };

  try {
    // Validate if user exist in our database

    const oldWholeSaler = await WholeSaler.findOne({
      where: { phoneNumber: userInfo.phoneNumber },
    });

    if (oldWholeSaler) {gi
      return res.status(409).json("User Already Exist. Please Login");
    }

    let encryptedPassword = await bcrypt.hash(req.body.password, 10);

    //calling function
    let addressId = await createAddress(req.body.address);
    userInfo.password = encryptedPassword;
    userInfo.addressId = addressId;
    let wholeSaler = await WholeSaler.create(userInfo);
    let address = await wholeSaler.getAddress();
    const token = jwt.sign(
      { id: wholeSaler.id, phoneNumber:wholeSaler.phoneNumber },
      process.env.ACCESS_TOKEN_SECRET
    );
   const user={
      id: wholeSaler.id,
      lName: wholeSaler.lName,
      fName: wholeSaler.fName,
      phoneNumber: wholeSaler.phoneNumber,
    }
    res
      .status(200)
      .json({user,accessToken: token});

    console.log("wholeSaler", JSON.stringify(wholeSaler));
  } catch (err) {
    console.log("Error while creating wholeSaler" + err);
    res.status(400).json("Error while creating wholeSaler" + err);
  }
};

const createAddress = async (address) => {
  try {
    const newaddress = await Address.create(address);
    return newaddress.id;
  } catch (error) {
    throw "Error"+error;
  }
};

const getAccount = async (req, res) => {
  let id = req.params.id;
  let wholeSaler = await WholeSaler.findOne({
    where: { id: id },
    attributes: { exclude: ["addressId", "password"] },
    include: "address",
  });
  if (!wholeSaler) {
    res.status(404).json("WholeSaler Not FOund");
  }
  res.status(200).json(wholeSaler);
  console.log(wholeSaler);
};

//update user

const update = async (req, res) => {
  let id = req.params.id;
  let wholeSaler = await WholeSaler.update(req.body, { where: { id: id } });
  if (wholeSaler == 1) {
    res.status(200).json(
      await WholeSaler.findOne({
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
