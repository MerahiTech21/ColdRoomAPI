module.exports=(sequelize,DataTypes)=>{
    const address=sequelize.define("address",{
        region:{
            type:DataTypes.STRING,
            allowNull:false,

        },
        zone:{
            type:DataTypes.STRING,
            allowNull:true,

        },
        woreda:{
            type:DataTypes.STRING,
           
        },
        kebele:{
            type:DataTypes.STRING,
          
            allowNull:true

        },
        kebele:{
            type:DataTypes.STRING,
            allowNull:true

        },
        location:{
            type:DataTypes.STRING,
            allowNull:true

        }

    });
    return address;

}