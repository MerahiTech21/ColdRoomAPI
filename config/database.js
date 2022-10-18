const Sequelize=require('sequelize')

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

module.exports ={db,sequelize};
