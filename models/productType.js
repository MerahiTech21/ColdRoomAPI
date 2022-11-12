module.exports=(sequelize,DataTypes)=>{
    const productType=sequelize.define("productType",
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

