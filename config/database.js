const Sequelize=require('sequelize');
const DataTypes=require('sequelize');
//const coldRoom = require('../models/coldRoom.js');

const sequelize= new Sequelize('cold-room','root','',{dialect:'mysql',host:'localhost',port:'3308',});

try {
    sequelize.authenticate();
   console.log('Sequelize Connection has been established successfully.');
 } catch (error) {
   console.error('Sequelize Unable to connect to the database:', error);
 }
 
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
 db.wholeSaler=require('../models/wholeSaler.js')(sequelize,DataTypes);
 db.order=require('../models/order.js')(sequelize,DataTypes);
 db.productTypePrice=require('../models/productTypePrice.js')(sequelize,DataTypes);





 


 db.sequelize.sync({force:true}).then(()=>{
  console.log('yes re-sync is done')
}).catch((err)=>{
  console.log(err);
});

//creating a relationship
db.coldRoom.belongsTo(db.address,{
  foreignKey:'addressId',
  as:'address'
});
db.employee.belongsTo(db.account,{
  foreignKey:'accountId',
  as:'account',

});
db.coldRoom.belongsTo(db.employee,{
  foreignKey:'employeeId',
  as:'employee'
});
 db.farmer.belongsTo(db.address,{
  foreignKey:'addressId',
  as:'address'

});
 db.product.hasMany(db.productType);
 db.productType.belongsTo(db.product);
 db.productType.belongsToMany(db.coldRoom,{through:db.coldRoomProduct });
 db.coldRoom.belongsToMany(db.productType,{through:db.coldRoomProduct});
//  db.rent.belongsTo(db.coldRoom);
//  db.coldRoom.hasOne(db.rent);
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




module.exports ={db,sequelize};
