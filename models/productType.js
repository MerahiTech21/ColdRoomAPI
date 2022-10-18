const { DataTypes } = require("sequelize")

module.exports=(sequelize,Datatypes)=>{
    const productType=sequelize.define("ProductType",
    {
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

    )

}

