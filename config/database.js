const Sequelize=require('sequelize');
const DataTypes=require('sequelize');
const coldRoom = require('../models/coldRoom.js');

const sequelize= new Sequelize('cold-room','root','',{dialect:'mysql',host:'localhost',port:'3306',})

try {
    sequelize.authenticate();
   console.log('Sequelize Connection has been established successfully.');
 } catch (error) {
   console.error('Sequelize Unable to connect to the database:', error);
 }
 
 const db ={}

 db.sequelize=sequelize
 db.Sequelize=Sequelize

 const address=require('../models/address.js')(sequelize,DataTypes);
 const ColdRoom=require('../models/coldRoom.js')(sequelize,DataTypes);
 const farmer=require('../models/farmer.js')(sequelize,DataTypes);


 db.sequelize.sync({force:false}).then(()=>{
  console.log('yes re-sync is done')
}).catch((err)=>{
  console.log('fail to re-sync');
});

coldRoom.belongsTo(address);
farmer.belongsTo(address);

module.exports ={db,sequelize};
