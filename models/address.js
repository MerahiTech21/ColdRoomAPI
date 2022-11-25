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
<<<<<<< HEAD
           
        },
        kebele:{
            type:DataTypes.STRING,
          
=======
            allowNull:true

        },
        kebele:{
            type:DataTypes.STRING,
            allowNull:true

>>>>>>> 88477afec52efd1e800029f96a264d057e2937f9
        },
        location:{
            type:DataTypes.STRING,
            allowNull:true

        }

    });
    return address;

}