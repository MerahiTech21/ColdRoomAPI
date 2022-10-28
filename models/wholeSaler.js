module.exports=(sequelize,DataTypes)=>{
    const wholeSaler=sequelize.define(
        'wholeSaler',{
            fName:{
                type:DataTypes.STRING,
                allowNull:false,

            },
            lName:{
                type:DataTypes.STRING,
                allowNull:false,

            },
            phoneNumber:{
                type:DataTypes.STRING,
                allowNull:false,
                unique:true,
            },
            sex:{
                type:DataTypes.STRING

            },password:{
                type:DataTypes.STRING,
               allowNull:false,
    
            }
        }
    );
    return wholeSaler;

}