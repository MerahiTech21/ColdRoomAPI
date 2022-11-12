const Sequelize=require('sequelize');
const DataTypes=require('sequelize');
//const coldRoom = require('../models/coldRoom.js');

 //const sequelize= new Sequelize('cold-room','root','',{dialect:'mysql',host:'localhost',port:'3306',});
const sequelize= new Sequelize('merahitechnologi_cold_room','merahitechnologi_cold_room_user','C}LeGld72#_c',{dialect:'mysql',host:'merahitechnologies.com',port:'3306',});
  
try {
   sequelize.authenticate();
   console.log('Sequelize Connection has been established successfully.');
 } catch (error) {
   console.log('Sequelize Unable to connect to the database:');
 }
     
 try{
 const db ={};
 db.sequelize=sequelize;
 db.Sequelize=Sequelize;
 //importing a model
 db.product=require('../models/product.js')(sequelize,DataTypes);
 db.address=require('../models/address.js')(sequelize,DataTypes);
 db.account=require('../models/account.js')(sequelize,DataTypes);
 db.employee=require('../models/employee.js')(sequelize,DataTypes);
 db.coldRoom=require('../models/coldRoom.js')(sequelize,DataTypes);
 db.farmer=require('../models/farmer.js')(sequelize,DataTypes);
 db.productType=require('../models/productType.js')(sequelize,DataTypes);
 db.coldRoomProduct=require('../models/coldRoomProduct.js')(sequelize,DataTypes);
 db.rent=require('../models/rent.js')(sequelize,DataTypes);
//  db.rent1=require('../models/rent.js')(sequelize,DataTypes);
 db.wholeSaler=require('../models/wholeSaler.js')(sequelize,DataTypes);
 db.order=require('../models/order.js')(sequelize,DataTypes);
 db.productTypePrice=require('../models/productTypePrice.js')(sequelize,DataTypes);
 db.farmerProduct=require('../models/farmer-product')(sequelize,DataTypes);
 db.OrderItem=require('../models/order-item')(sequelize,DataTypes);
 db.OrderLog=require('../models/order-log')(sequelize,DataTypes);
 db.OrderPaymentLog=require('../models/order-payment-log')(sequelize,DataTypes);
 db.FarmerBalance=require('../models/farmer-balance')(sequelize,DataTypes);
 db.FarmerRent=require('../models/farmer-rent')(sequelize,DataTypes)




//creating a relationship
db.coldRoom.belongsTo(db.address,{
  foreignKey:'addressId',
  as:'address'
});
// db.employee.belongsTo(db.account,{
//   foreignKey:'accountId',
//   as:'account',

// });
db.coldRoom.belongsTo(db.employee,{
 // foreignKey:'employeeId',
//  as:'employee'
});

db.employee.hasOne(db.coldRoom)


 db.farmer.belongsTo(db.address,{
  foreignKey:'addressId',
  as:'address'

});
db.wholeSaler.belongsTo(db.address,{
  foreignKey:'addressId',
  as:'address'

});
 db.product.hasMany(db.productType);
 db.productType.belongsTo(db.product);

 db.coldRoom.hasOne(db.rent);
 db.rent.belongsTo(db.coldRoom);
 
db.order.belongsTo(db.coldRoom,{
  foreignKey:'coldRoomId',
  as:'coldRoom',
});
db.wholeSaler.hasMany(db.order);
db.order.belongsTo(db.wholeSaler);


db.productType.hasOne(db.productTypePrice);
db.productTypePrice.belongsTo(db.productType);
db.coldRoom.hasOne(db.productTypePrice);
db.productTypePrice.belongsTo(db.coldRoom);
//////
db.farmerProduct.belongsTo(db.product)
db.product.hasMany(db.farmerProduct)
db.farmerProduct.belongsTo(db.farmer)
db.farmer.hasMany(db.farmerProduct)
db.farmerProduct.belongsTo(db.productType)
db.productType.hasMany(db.farmerProduct)

db.productType.belongsToMany(db.coldRoom,{through:db.coldRoomProduct });
db.coldRoom.belongsToMany(db.productType,{through:db.coldRoomProduct});

db.coldRoomProduct.belongsTo(db.coldRoom)
db.coldRoomProduct.belongsTo(db.productType) 

////

db.farmer.belongsToMany(db.productType,{through:db.farmerProduct})
db.productType.belongsToMany(db.farmer,{through:db.farmerProduct})

//  order Item
db.order.hasMany(db.OrderItem)
db.OrderItem.belongsTo(db.order)
db.farmerProduct.hasMany(db.OrderItem)
db.OrderItem.belongsTo(db.farmerProduct)
/// order Log related
db.order.hasMany(db.OrderLog);
db.OrderLog.belongsTo(db.order)
db.order.hasMany(db.OrderPaymentLog)
db.OrderPaymentLog.belongsTo(db.order)

//Farmer Balance nd Rent related
db.FarmerBalance.belongsTo(db.OrderItem)
db.FarmerBalance.belongsTo(db.farmer)
db.farmer.hasMany(db.FarmerBalance)
db.FarmerBalance.belongsTo(db.farmerProduct)
   
db.FarmerRent.belongsTo(db.OrderItem)
db.FarmerRent.belongsTo(db.farmer)
db.farmer.hasMany(db.FarmerRent)
 
db.FarmerRent.belongsTo(db.farmerProduct)

db.coldRoom.hasMany(db.FarmerBalance)
db.FarmerBalance.belongsTo(db.coldRoom)

db.coldRoom.hasMany(db.FarmerRent)
db.FarmerRent.belongsTo(db.coldRoom)

db.coldRoom.hasMany(db.farmerProduct);
db.farmerProduct.belongsTo(db.coldRoom)
 
db.sequelize.sync({force:false}).then(()=>{

  //  db.FarmerBalance.sync({force:true}).then(()=>{})
  //  db.FarmerRent.sync({force:true}).then(()=>{})
    console.log('yes re-sync is done')
}).catch((err)=>{
  console.log('sequelize err bro',err);
   
});


module.exports ={db,sequelize};
 }catch(err){
  console.log('seems database error',err)
 }
