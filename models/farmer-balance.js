module.exports=(sequelize,DataTypes)=>{
    const FarmerBalance=sequelize.define("farmerBalance",{
   
        balanceAmount:{
            type:DataTypes.DOUBLE,
            allowNull:false

        },
        quantity:{
            type:DataTypes.DOUBLE,
            allowNull:false

        },
        state:{
            type:DataTypes.STRING,
            allowNull:false

        },
        rentAmount:{
            type:DataTypes.DOUBLE,
            allowNull:false 
        },
        rentPrice:{
            type:DataTypes.DOUBLE,
            allowNull:false   
        }

    })
    return FarmerBalance

}