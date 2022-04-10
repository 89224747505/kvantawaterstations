const UserService = require('../service/userService');
const {validationResult} = require('express-validator');
const ApiError = require('../exeptions/apiError')
const {response} = require("express");

class UserController {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async registration(req, res, next) {
        try {
            //Достаем из реквеста ошибки, если таковые имеются
            const errors = validationResult(req);

            //Проверяем если есть ошибки, то выдаем ошибки валидации и отправляем их массивом
            if (!errors.isEmpty()) return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));

            //Дастаем данные из тела запроса
            const {email, password, phone} = req.body;

            //Регистрируем нового пользователя с помощью сервиса регистарции пользователей
            const userData = await UserService.registration(email, password, phone);

            //Помещаем refreshToken в cookie и задаем ему параметры жизни 30 дней и флаг,
            //который не позволяет изменять куку на стороне клиента с помощью JS
            res.cookie('refreshToken', userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})

            //Отправляем данные на сервер со статусом 200 и данными полученными из сервиса
            return res.status(200).json(userData);
        } catch (e) {
            next(e);
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async login(req, res, next) {
        try {
            //Дастаем данные из тела запроса
            const {email, password, smsMessage} = req.body;
            //Обращаемся к юзер-сервису функции login для логинизации нашего пользователя
            const userData = await UserService.login(email, password, smsMessage);

            //Если userData равно -1 (то есть смс не отправилось на телефон), тогда прокинуть ошибку для повторения запроса
            if (userData === -1) return res.status(408).json({status: -1, message: 'Повторите запрос на отправку смс'})

            //Если userData равно 1 (то есть смс-сообщение отправилось на телефон), тогда оправить 100 ответ и ожидать следющих действий
            if (userData === 1) return res.status(201).json({status: 1, message: 'Получите СМС и введите в форму'});

            //Если userData равно 0, то это означает, что произошла непредвиденная ошибка в UserService
            if (userData === 0) return res.status(500).json({status: 0, message: 'Непредвиденная ошибка сервера'});

            //Если userData равно -2, то это значит что введен неправельный код из СМС
            if (userData === -2) return res.status(400).json({
                status: -2,
                message: 'Неправильно введен код из СМС-сообщения'
            })

            //Помещаем refreshToken в cookie и задаем ему параметры жизни 30 дней и флаг,
            //который не позволяет изменять куку на стороне клиента с помощью JS
            res.cookie('refreshToken', userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})

            //Отправляем данные на сервер со статусом 200 и данными полученными из сервиса
            return res.status(200).json(userData);
        } catch (e) {
            next(e);
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async logout(req, res, next) {
        try {
            //Достаем refreshToken из cookies и помещаем его в одноименную переменную
            const {refreshToken} = req.cookies;

            //Если refreshToken пустой, то отправляем ошибку
            if (!refreshToken) return next(ApiError.BadRequest("Нет залогиненного пользователя на клиенте", {resultCode: 1}));

            //Вызываем сервисуную фунцкию логаута из юзер сервиса и передаем в нее этот рефреш токен
            await UserService.logout(refreshToken);

            //Удаляем куку refreshToken
            res.clearCookie('refreshToken');

            //Отправляем ответ на
            return res.status(200).json({"message": "Пользователь вышел из профиля", resultCode: 0});
        } catch (e) {
            next(e);
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async activate(req, res, next) {
        try {
            //Доставем из строки параметров /activate/:link - link и помещаем ее в константу activationLink
            const activationLink = req.params.link;

            //Обращаемся к функции активации юзер-сервиса и передаем туда ссылку
            await UserService.activate(activationLink);

            //Делаем редирект с серверного URL на клиентский URL
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e);
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async refresh(req, res, next) {
        try {
            //Достаем refreshToken из cookies и помещаем его в одноименную переменную
            const {refreshToken} = req.cookies;

            //Если refreshToken пустой, то отправляем ошибку
            if (!refreshToken) return next(ApiError.BadRequest("Нет залогиненного пользователя на клиенте", {resultCode: 1}));

            //Обращаемся к юзер-сервису функции refresh для одновления нашего токена
            const userData = await UserService.refresh(refreshToken);

            //Помещаем refreshToken в cookie и задаем ему параметры жизни 30 дней и флаг,
            //который не позволяет изменять куку на стороне клиента с помощью JS
            res.cookie('refreshToken', userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})

            //Отправляем данные на сервер со статусом 200 и данными полученными из сервиса
            return res.status(200).json(userData);
        } catch (e) {
            next(e);
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async accessForUsers(req, res, next) {
        //Дастаем данные из тела запроса
        const {email, role, password, isActivated, phone, allowFrames} = req.body;

        try {
            const response = await UserService.accessForUsers(email, role, password, isActivated, phone, allowFrames);

            //Отравляем положительный ответ
            if (response === 1) return res.status(200).json({
                status: 1,
                message: "Данные в БД у пользователя обновлены"
            });

            //Отравляем ответ об ошибке при попытке записи в БД
            if (response === 0) return res.status(500).json({status: 0, message: "Ошибка при записи данных в БД"})

        } catch (e) {
            next(e);
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteUser(req, res, next) {
        try {
            //Доставем из строки параметров /user/:id - id и помещаем ее в константу userId
            const userId = req.params.id;

            //Обращаемся к функции удаления юзер-сервиса и передаем туда userId
            const response = await UserService.deleteUser(userId);

            //Отравляем положительный ответ
            if (response.status === 1) return res.status(200).json({status: 1, message: "Пользователь удален"});

        } catch (e) {
            next(e);
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async updateUser(req, res, next) {
        try {
            //Дастаем данные из тела запроса
            const {id, email, role, password, isActivated, phone, allowFrames} = req.body;

            //Обращаемся к функции обновления юзер-сервиса и передаем туда userId
            const response = await UserService.updateUser(id, email, phone, password, role, isActivated, allowFrames);

            //Отравляем положительный ответ
            if (response === 1) return res.status(200).json({
                status: 1,
                message: "Данные в БД у пользователя обновлены"
            });

            //Отравляем ответ об ошибке при попытке записи в БД
            if (response === 0) return res.status(500).json({status: 0, message: "Ошибка при записи данных в БД"})
        } catch(e) {
            console.log("ОШИБКАОШИБКАОШИБКАОШИБКАОШИБКАОШИБКАОШИБКА");
            console.log(e);
            next(e);
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async createNewProfileAdmin(req, res, next) {
        try {
            //Дастаем данные из тела запроса
            const {email, phone, password, role, isActivated, allowFrames} = req.body;

            //Регистрируем нового пользователя с помощью сервиса регистарции пользователей
            const userData = await UserService.createNewProfileAdmin(email, phone, password, role, isActivated, allowFrames);

            //Помещаем refreshToken в cookie и задаем ему параметры жизни 30 дней и флаг,
            //который не позволяет изменять куку на стороне клиента с помощью JS
            res.cookie('refreshToken', userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})

            //Отправляем данные на сервер со статусом 200 и данными полученными из сервиса
            return res.status(200).json(userData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();