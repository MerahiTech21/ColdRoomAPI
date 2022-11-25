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
          
        },
        location:{
            type:DataTypes.STRING,
        }

    });
    return address;

}