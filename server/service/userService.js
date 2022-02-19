const {User} = require("../models/models");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('../service/mailService')
const TokenService = require('../service/tokenService');
const UserDto = require('../DTO/userDto');
const ApiError = require('../exeptions/apiError');


class UserService {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async registration (email, password) {
        //Ищем пользователя в БД с таким же почтовым адресом
        const candidate = await User.findOne({where:{email}});

        //Если найден пользователь с таким почтовым адресом, то выдать ошибку регистрации на данный емейл
        if (candidate) throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);

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
        await User.update({refreshToken:tokens.refreshToken},{where:{id:userDto.id}})

        return {...tokens,user: userDto}
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async activate(activationLink){
        //Ищем в БД пользователя с переданной нам ссылкой активации
        const user = await User.findOne({where:{activationLink}});

        //Если не найден пользователь с такой ссылкой активации, то выдать ошибку регистрации на данный емейл
        if (!user) throw ApiError.BadRequest(`Некорректная ссылка активации`);

        //Записываем в БД в поле isActivated = true, то если что активация подтверждена
        const userUpdateActivated = await User.update({isActivated: true}, {where:{activationLink}});
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async login(email, password) {
        //Ищем пользователя в БД с таким же почтовым адресом
        const user = await User.findOne({where:{email}});

        //Если найден пользователь с таким почтовым адресом, то выдать ошибку регистрации на данный емейл
        if (!user) throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} не найден`);

        //Если аккаунт не активирован, то отправляется ошибка
        if (!user.dataValues.isActivated) throw ApiError.BadRequest(`Пользователь не активировал аккаунт`);

        //Хэшируем переданный нам пароль и сравниваем его с паролем из БД
        const isComparePasswords = await bcrypt.compare(password, user.dataValues.password);

        //Если пароли не равны, то посылаем ошибку
        if (!isComparePasswords) throw ApiError.BadRequest(`Указан неверный пароль пользователя`);

        //Создаем DTO и выбираем нужные нам поля в объекте для более удобной работы
        const userDto = new UserDto(user.dataValues);

        //Генерируем новые ACCESS и REFRESH токены
        const tokens = TokenService.generateTokens({...userDto})

        //Обновляем у пользователя в БД значение refreshToken
        await User.update({refreshToken:tokens.refreshToken},{where:{id:userDto.id}})

        return {...tokens,user: userDto}
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async logout(refreshToken) {
        //Обновляем у пользователя в БД значение refreshToken присваиваем ему значение null
        await User.update({refreshToken:null},{where:{refreshToken}})
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async refresh(refreshToken) {
        //Проверяем если refreshToken отсутствует, то ошибка нет авторизации
        if (!refreshToken) throw ApiError.UnauthorizedError();

        //Проверяем валидность refreshToken
        const userData = TokenService.validateRefreshToken(refreshToken);

        //Находим в БД пользователя с refreshToken
        const userFromDB = await TokenService.findToken(refreshToken);

        //Проверяем условие, что и валидация и поиск в БД успешны, если нет, то ошибка авторизации
        if (!userData || !userFromDB) throw ApiError.UnauthorizedError();

        //Создаем DTO и выбираем нужные нам поля в объекте для более удобной работы
        const userDto = new UserDto(userFromDB);

        //Генерируем новые ACCESS и REFRESH токены
        const tokens = TokenService.generateTokens({...userDto})

        //Обновляем у пользователя в БД значение refreshToken
        await User.update({refreshToken:tokens.refreshToken},{where:{id:userDto.id}})

        return {...tokens,user: userDto}
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async getAllUsers() {
        let queryParams = {
            where: {},
            order: [ [ 'id', 'ASC' ] ]
        };
        const users = await User.findAll(queryParams);
        return users;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

module.exports = new UserService();