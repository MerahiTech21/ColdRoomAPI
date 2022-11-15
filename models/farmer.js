module.exports=(sequelize,DataTypes)=>{
    const farmer=sequelize.define("farmer",
    {
        fName:{
            type:DataTypes.STRING,
        },
        lName:{
            type:DataTypes.STRING,
        },
        phoneNumber:{
            type:DataTypes.STRING,
            // validate:{
            //   unique:{
            //     msg:'User Already Registed please Login'
            //   }
            // },
            unique:true,

        },
        sex:{
            type:DataTypes.STRING,


        },password:{
            type:DataTypes.STRING,
           allowNull:false,

        }
    }
        
    );
    return farmer;

}