const {User} = require("../models/models");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('../service/mailService')
const TokenService = require('../service/tokenService');
const UserDto = require('../DTO/userDto');

class UserService {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async registration (email, password) {
        //Ищем пользователя в БД с таким же почтовым адресом
        const candidate = await User.findOne({email});

        //Если найден пользователь с таким почтовым адресом, то выдать ошибку регистрации на данный емейл
        if (candidate) throw new Error(`Пользователь с почтовым адресом ${email} уже существует`);

        //Хэшируем переданный нам пароль для записи в БД закодированного пароля
        const hashPassword = await bcrypt.hash(password, 3);

        //Генерируем рандомную строку для ссылки активации
        const activationLink = uuid.v4();

        //Создаем нового пользователя
        const user = await User.create({email, password:hashPassword, activationLink});

        //Отправляем письмо для активации аккаунта на емейл кандидата
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        //Создаем DTO и выбираем нужные нам поля в объекте для более удобной работы
        const userDto = new UserDto(user);

        //Генерируем новые ACCESS и REFRESH токены
        const tokens = TokenService.generateTokens({...userDto})

        //Обновляем у пользователя в БД значение refreshToken
        const userUpdateJwt = await User.update({refreshToken:tokens.refreshToken},{where:{id:userDto.id}})

        return {...tokens,user: userDto}
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

module.exports = new UserService();