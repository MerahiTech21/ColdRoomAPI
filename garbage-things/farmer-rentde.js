module.exports=(sequelize,DataTypes)=>{
    const FarmerRent=sequelize.define("farmerRent",{
        rentPrice:{
            type:DataTypes.DOUBLE,
            allowNull:false

        },
        rentAmount:{
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

        }

    })
    return FarmerRent

}