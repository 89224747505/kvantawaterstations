const sequelize = require('./../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: false, allowNull:false, validate:{isEmail:true}},
    password: {type: DataTypes.STRING, allowNull: false},
    role:{type:DataTypes.STRING, allowNull:false, defaultValue: "USER", validate: {isIn:[['USER','ADMIN']]}},
    isActivated:{type:DataTypes.BOOLEAN, defaultValue:false, allowNull: false},
    activationLink:{type:DataTypes.STRING, allowNull: true},
    refreshToken:{type: DataTypes.STRING(500), allowNull: true},
    phone:{type: DataTypes.STRING(12), allowNull: false},
    messageSms:{type: DataTypes.STRING(10), defaultValue:'000000', allowNull: false},
    allowFrames:{type: DataTypes.STRING(1000), defaultValue:'', allowNull: false},
});

const WaterNodes = sequelize.define('waternodes', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    nameNode:{type:DataTypes.STRING, allowNull: true},
    ipAddress:{type:DataTypes.STRING, allowNull: true},
});

module.exports = {User, WaterNodes};