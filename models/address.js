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
            allowNull:false

        },
        kebele:{
            type:DataTypes.STRING,
            allowNull:false

        },
        location:{
            type:DataTypes.STRING,
        }

    });
    return address;

}