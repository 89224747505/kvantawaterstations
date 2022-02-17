const sequelize = require('./../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: false, allowNull:false, validate:{isEmail:true}},
    password: {type: DataTypes.STRING, allowNull: false},
    isActivated:{type:DataTypes.BOOLEAN, defaultValue:false, allowNull: false},
    activationLink:{type:DataTypes.STRING, allowNull: true},
    refreshToken:{type: DataTypes.STRING, allowNull: true}
});

module.exports = {User};