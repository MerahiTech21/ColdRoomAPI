module.exports=(sequelize,DataTypes)=>{
    const farmer=sequelize.define("farmer",
    {
        fname:{
            type:DataTypes.STRING,
        },
        lname:{
            type:DataTypes.STRING,
        },
        phoneNo:{
            type:DataTypes.STRING,
            unique:true,

        },
        sex:{
            type:DataTypes.STRING,


        }
    }
        
    );

}