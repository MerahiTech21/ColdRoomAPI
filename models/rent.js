module.exports=(sequelize,DataTypes)=>{
    const rent=sequelize.define("rent",{
        price:{
            type:DataTypes.DOUBLE,
        }

    })     
       return rent


}  