const {User} = require("../models/models");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('../service/mailService')
const TokenService = require('../service/tokenService');
const SmsService = require('../service/smsService');
const UserDto = require('../DTO/userDto');
const ApiError = require('../exeptions/apiError');


class UserService {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async registration (email, password, phone) {
        //Ищем пользователя в БД с таким же почтовым адресом
        const candidate = await User.findOne({where:{email}});

        //Если найден пользователь с таким почтовым адресом, то выдать ошибку регистрации на данный емейл
        if (candidate) throw ApiError.BadRequest(`Пользователь ${email} уже существует`);

        //Хэшируем переданный нам пароль для записи в БД закодированного пароля
        const hashPassword = await bcrypt.hash(password, 3);

        //Генерируем рандомную строку для ссылки активации
        const activationLink = uuid.v4();

        //Создаем нового пользователя
        const user = await User.create({email, password:hashPassword, activationLink, phone});

        //Отправляем письмо для активации аккаунта на емейл кандидата
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        //Создаем DTO и выбираем нужные нам поля в объекте для более удобной работы
        const userDto = new UserDto(user);

        return {user: userDto}
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
    async login(email, password, sms) {
        //Ищем пользователя в БД с таким же почтовым адресом
        const user = await User.findOne({where:{email}});

        //Если не найден пользователь с таким почтовым адресом, то выдать ошибку регистрации на данный емейл
        if (!user) throw ApiError.BadRequest(`Пользователь ${email} не найден`);

        //Если аккаунт не активирован, то отправляется ошибка
        if (!user.dataValues.isActivated) throw ApiError.BadRequest(`Пользователь не активировал аккаунт на почте`);

        //Хэшируем переданный нам пароль и сравниваем его с паролем из БД
        const isComparePasswords = await bcrypt.compare(password, user.dataValues.password);

        //Если пароли не равны, то посылаем ошибку
        if (!isComparePasswords) throw ApiError.BadRequest(`Указан неверный пароль пользователя`);

        //Создаем DTO и выбираем нужные нам поля в объекте для более удобной работы
        const userDto = new UserDto(user.dataValues);

        //Проверяем условие если смс-сообщение еще не отправлено
        if (typeof sms == 'undefined') {
            // Доставем номер телефона из DTO пользователя
            const phoneNumber = userDto.phone;

            // Достаем login из переменных окружения
            const login = process.env.SMS_USER;

            // Достаем пароль из переменных окружения
            const passSms = process.env.SMS_PASSWORD;

            // Генерируем случайное число размером взятым из переменной окружения и передаем в messageCode для последующей отправки
            let messageCode = SmsService.generateNumberForMessage(process.env.SMS_NUMBER_OF_SYMBOLS);

            try {
                // Отправляем запрос для формирования СМС-сообщения по номеру:phoneNumber с текстом messageCode
                // Для авторизации Basic токеном также передаем login и passSms
                //await SmsService.sendSms(phoneNumber, messageCode, login, passSms);
                console.log(messageCode);
                //Обновляем у пользователя в БД значение messageSms присваиваем сгенерированный messageCode
                await User.update({messageSms: messageCode}, {where: {id: userDto.id}})

                // Возвращем 1, это означает, что СМС-сообщение отправлено и можно делать ответ для дальнейшего подтверждения
                return 1;
            } catch (e) {
                // Если приходит ошибка из СМС-сервиса, то возвращаем ответ -1
                return -1;
            }
        }
        if (sms && userDto.messageSms === sms) {

            //Генерируем новые ACCESS и REFRESH токены
            const tokens = TokenService.generateTokens({...userDto})

            //Обновляем у пользователя в БД значение refreshToken
            await User.update({refreshToken: tokens.refreshToken}, {where: {id: userDto.id}})

            return {...tokens, user: userDto}
        } else return -2;
        return 0;
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

        const responseUsers = [];

        for (let item of users)
            responseUsers.push({
                id:item.dataValues.id,
                email:item.dataValues.email,
                phone:item.dataValues.phone,
                role:item.dataValues.role,
                allowFrames:item.dataValues.allowFrames,
            })

        return responseUsers;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async accessForUsers(email, role, password, isActivated, phone, allowFrames) {

        //Ищем пользователя в БД с таким же почтовым адресом
        const user = await User.findOne({where:{email}});

        //Если не найден пользователь с таким почтовым адресом, то выдать ошибку поиска на данный емейл
        if (!user) throw ApiError.BadRequest(`Пользователь ${email} не найден`);

        //Создаем DTO и выбираем нужные нам поля в объекте для более удобной работы
        const userDto = new UserDto(user.dataValues);
        try {
            //Обновляем у пользователя в БД значение refreshToken
            await User.update({role, password, isActivated, phone, allowFrames}, {where: {id: userDto.id}})

        } catch (e) {
            //Возвращаем 0 значит была допущена ошибка при записи на сервер
            console.log(e);
            return 0;
        }

        // Возвращаем 1 значит все хорошо и операция выполнена
        return 1;
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteUser(id) {
        //Ищем пользователя в БД с таким же id адресом
        const candidate = await User.findOne({where:{id}});

        //Если не найден пользователь с таким id, то выдать ошибку удаления узла
        if (!candidate) throw ApiError.BadRequest(`Пользователь с id - ${id} не найден в БД`);

        if (candidate) {
            await candidate.destroy();
            return {status: 1, message: "Узел удален из БД"}
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async createNewProfileAdmin (email, phone, password, role, isActivated, allowFrames) {
        //Ищем пользователя в БД с таким же почтовым адресом
        const candidate = await User.findOne({where:{email}});

        //Если найден пользователь с таким почтовым адресом, то выдать ошибку регистрации на данный емейл
        if (candidate) throw ApiError.BadRequest(`Пользователь ${email} уже существует`);

        //Хэшируем переданный нам пароль для записи в БД закодированного пароля
        const hashPassword = await bcrypt.hash(password, 3);

        //Создаем нового пользователя
        const user = await User.create({email, phone, password:hashPassword, role, isActivated, allowFrames});

        //Создаем DTO и выбираем нужные нам поля в объекте для более удобной работы
        const userDto = new UserDto(user);

        return {user: userDto}
    }
}

module.exports = new UserService();