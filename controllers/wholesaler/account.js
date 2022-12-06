const { db } = require("../../config/database");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken')
const WholeSaler = db.wholeSaler;
const Address = db.address;
const nodeMailer=require('nodemailer');
const wholeSaler = require("../../models/wholeSaler");

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
const getWholeSaler=async(req,res)=>{
  let id=req.params.id;
  let wholeSaler=await WholeSaler.findOne({where:{
     id:id
  },attributes:{exclude: ['password','sex',"createdAt","updatedAt","addressId"]}})
  res.status(200).json(wholeSaler);
}


const emailSend=async(req,res)=>{
  res.json('hii');
let mailTransporter= await nodeMailer.createTransport({
   service: "gmail",
   auth:{
     user: "dayanyenesew@gmail.com",
     password: "dayanmulu16",
   }
});

let details={
  from: "dayanyenesew@gmail.com",
  to: "derejeseifu3030@gmail.com",
  subject: "test",
  text:"testing our first send"
}
  await mailTransporter.sendMail(details,(err)=>{
  if(err){
    console.log("hass an err");
  }
  else{
    console.log("email send");
  }

})}

const forgotPassword = async (req, res, next) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const wholeSaler = await WholeSaler.findOne({ where: { phoneNumber } });
    if (!wholeSaler) {
      return res.status(404).json({ msg: `User not found with phoneNumber=${phoneNumber}` });
    }
    const token = Math.floor(100000 + Math.random() * 900000);
    wholeSaler.token = token;
    await wholeSaler.save();
    const extractedPhoneNumber=phoneNumber.substring(0);
    const finalPhoneNumber="+251".concat(extractedPhoneNumber);
     await sendSMS(finalPhoneNumber,token);
    res.status(200).json(`We have sent sms to ${wholeSaler.phoneNumber}`);
  } catch (e) {
    res.status(400).json(e.toString());
  }

};

const verifyToken = async (req, res, next) => {
  const phoneNumber=req.params.phoneNumber;
   const tokenCode=req.body.tokenCode;
  const wholeSaler = await WholeSaler.findOne({ where: { phoneNumber } });
  if (!wholeSaler) {
    return res.status(404).json({ msg: `User not found with phoneNumber=${phoneNumber}` });
  }
  //it should be compared by jwt
  if (!tokenCode === wholeSaler.token) {
    return res.status(400).json({ msg: 'invalid or expired token' })
  }
   farmer.token='';
  await wholeSaler.save();
  const token = jwt.sign({ ...farmer.dataValues }, process.env.ACCESS_TOKEN_SECRET);
  res.status(200).json({ token, id:wholeSaler.id, name: wholeSaler.name , phoneNo: wholeSaler.phoneNo })
  // let it loign 
};


const resetForgotPassword = async (req, res, next) => {
  try{
    const { newPassword } = req.body;
  const wholeSaler = await WholeSaler.findByPk(req.params.id);
  if(!wholeSaler) return res.status(404).json({msg:"faild", wholeSaler: req.wholeSaler});
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


module.exports = {
  create,
  getAccount,
  update,
  getWholeSaler,
  emailSend,
  forgotPassword,
  verifyToken,
  resetForgotPassword,
};
