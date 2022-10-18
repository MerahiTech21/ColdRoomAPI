module.exports=(sequelize,DataTypes)=>{
    const wholeSaler=sequelize.define(
        'wholeSaler',{
            fname:{
                type:DataTypes.STRING,
                allowNull:false,

            },
            lname:{
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

            }
        }
    );
    return wholeSaler;

}