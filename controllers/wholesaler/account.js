const { db } = require("../../config/database");
const bcrypt = require("bcrypt");

const WholeSaler = db.wholeSaler;
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

    const oldWholeSaler = await WholeSaler.findOne({
      where: { phoneNumber: userInfo.phoneNumber },
    });

    if (oldWholeSaler) {
      return res.status(409).json("User Already Exist. Please Login");
    }

    let encryptedPassword = await bcrypt.hash(req.body.password, 10);

    //calling function
    let addressId = await createAddress(req.body.address);
    userInfo.password = encryptedPassword;
    userInfo.addressId = addressId;
    let wholeSaler = await WholeSaler.create(userInfo);
    let address = await wholeSaler.getAddress();

    res.status(200).json({wholeSaler,address});
    console.log("wholeSaler", JSON.stringify(wholeSaler));
  } catch (err) {
    console.log("Error while creating wholeSaler" + err);
    return;
  }
};

const createAddress = async (address) => {
  const newaddress = await Address.create(address);
  return newaddress.id;
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
