const jwt = require('jsonwebtoken')

class TokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn:'15m'});
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {expiresIn:'30d'});
        return {
            accessToken,
            refreshToken
        }

    }
}

module.exports = new TokenService();