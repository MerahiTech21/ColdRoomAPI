const { db } = require("../../config/database");
const bcrypt = require("bcrypt");

const Farmer = db.farmer;
const Address = db.address;

const AddFarmer=async(farmerData)=>{

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
          throw "User Already Exist. Please Login"
        }
    
        let encryptedPassword = await bcrypt.hash(farmerData.lName+'1234', 10);
    
        //calling function
    
        let addressId = await createAddress(farmerData.address);
    
        userInfo.password = encryptedPassword;
        userInfo.addressId = addressId;
        let farmer = await Farmer.create(userInfo);
        
       return farmer.id
      } catch (err) {
          throw err
      }
    };
    
    const createAddress = async (address) => {
      const newaddress = await Address.create(address);
      return newaddress.id;
    };

    const getFarmerRent=(req,res)=>{
    
    }
module.exports={AddFarmer}