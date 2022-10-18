const { DataTypes } = require("sequelize")

module.exports=(sequelize,Datatypes)=>{
    const productType=sequelize.define("ProductType",
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
            
        },
        title:{
            type:DataTypes.STRING,

        },
        imageUrl:{
            type:DataTypes.STRING,
            allowNull:false,

        },
        description:{
            type:DataTypes.STRING,

        },
    }

    );
    return productType;

}
