const { db } = require("../../config/database");
const bcrypt = require("bcrypt");

const Farmer = db.farmer;
const Address = db.address;
const FarmerBalance=db.FarmerBalance
const FarmerRent= db.FarmerRent
const FarmerProduct=db.farmerProduct

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

    const getFarmerProductHistory=async(req,res)=>{
      const fp=await farmerProduct.findAll({
        where:{farmerId:req.params.id},
        attributes:['productId'],
     include:[,{
      model:db.farmer ,
       attributes:['fName','lName']
    },{
      model:db.productType ,
       attributes:['name','imageUrl']
    }
    ],
      //  group:['createdAt'],
      
      });
      res.json(fp)
    }

 
const getFarmers=async(req,res)=>{
 
  try {
    
  const farmers=await Farmer.findAll({

    include:[
      {
        model:FarmerBalance,
 
      },
      {
        model:FarmerRent,

      }, {
        model:Address,
        as:'address'

      }, {
        model:FarmerProduct,

        
      }
    ],       
    //  group:['farmer.id','farmerBalances.farmerId','farmerRents.farmerId'],
      // raw:true

  })
  //console.log('far',farmers)

  const arrangedFarmers=farmers.map((farmer)=>{

    return {
          fullName:farmer.fName+ ' '+farmer.lName,
          location:farmer.address.woreda,
          totalProduct:farmer.farmerProducts.reduce((total,product)=>{
            return total+product.oldQuantity
          },0),
          totalBalance:farmer.farmerBalances.reduce((sum,balance)=>{
             return sum+balance.balanceAmount
          },0.0),
          totalRent:farmer.farmerRents.reduce((sum,rent)=>{
            return sum+rent.rentAmount
         },0.0),
    }
  })
   res.json(arrangedFarmers)

  } catch (error) {
   res.json(''+error) 
  }
}

module.exports={AddFarmer,getFarmerProductHistory,getFarmers}