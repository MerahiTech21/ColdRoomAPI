const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const sendSMS = require('../../util/sendSms');
const jwt = require('jsonwebtoken');


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

const forgotPassword = async (req, res, next) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const farmer = await Farmer.findOne({ where: { phoneNumber } });
    if (!farmer) {
      return res.status(404).json({ msg: `User not found with email=${email}` });
    }
    const token = Math.floor(100000 + Math.random() * 900000);
    farmer.token = token;
    await farmer.save();
     await sendSMS1(farmer.phoneNumber,token);
    res.status(200).send(`We have sent sms to ${farmer.phoneNumber}`);
  } catch (e) {
    res.status(400).send(e.toString());
  }

};

const verifyToken = async (req, res, next) => {
  const { tokenCode, phoneNumber } = req.body;
  const farmer = await Farmer.findOne({ where: { phoneNumber } });
  if (!farmer) {
    return res.status(404).json({ msg: `User not found with email=${email}` });
  }
  //it should be compared by jwt
  if (!tokenCode === farmer.token) {
    return res.status(400).json({ msg: 'invalid or expired token' })
  }
   farmer.token='';
  await farmer.save();
  const token = jwt.sign({ ...farmer.dataValues }, process.env.Access_TOKEN_SECURE);
  res.status(200).json({ token, name: farmer.name , phoneNo: user.phoneNo })
  // let it loign 
};


const resetForgotPassword = async (req, res, next) => {
  try{
    const { newPassword } = req.body;
  const user = await Farmer.findByPk(req.id);
  if(!user) return res.status(404).json({msg:"faild", user: req.user});
  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err.toString() })
    } else {
      user.password = hash;
      user.save().then((user) => {
        return res.status(200).json({ msg:"Password is changed successfully"});
      });

    }
  })
  }catch(e){
   res.status(400).json({error:e})
  }

};

const sendSMS1= async (req,res)=>{
  try{
    sendSMS("+251975752668","Test 123");
    res.send("Working good");
  }
  catch(e){
    console.log("faild to send email 🙌", e)
  }
}

module.exports = {
  create,
  getAccount,
  update,
  sendSMS1,
  verifyToken,
  resetForgotPassword,
  verifyToken,
  forgotPassword,
};
