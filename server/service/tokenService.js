const jwt = require('jsonwebtoken')
const {User} = require("../models/models");

class TokenService {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn:'10s'});
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {expiresIn:'30s'});
        return {
            accessToken,
            refreshToken
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.ACCESS_TOKEN);
            return userData;
        }catch (e){
            return null;
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_TOKEN);
            return userData;
        }catch (e){
            return null;
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async findToken(refreshToken) {
        const tokenData = await User.findOne({where:{refreshToken}});
        return tokenData.dataValues;
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

module.exports = new TokenService();