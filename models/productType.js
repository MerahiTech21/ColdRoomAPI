module.exports=(sequelize,DataTypes)=>{
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
            allowNull:true,


        },
    }

    );
    return productType;

}

