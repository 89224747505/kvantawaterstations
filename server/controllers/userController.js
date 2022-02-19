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

            //Проверяем если есть ошибки, то выдаем ошибк ивалидации и отправляем их массивом
            if (!errors.isEmpty()) return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));

            //Дастаем данные из тела запроса
            const {email, password} = req.body;

            //Регистрируем нового пользователя с помощью сервиса регистарции пользователей
            const userData = await UserService.registration(email, password);

            //Помещаем refreshToken в cookie и задаем ему параметры жизни 30 дней и флаг,
            //который не позволяет изменять куку на стороне клиента с помощью JS
            res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

            //Отправляем данные на сервер со статусом 200 и данными полученными из сервиса
            return res.status(200).json(userData);
        }catch (e){
            next(e);
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async login(req, res, next) {
        try {
            //Дастаем данные из тела запроса
            const {email, password} = req.body;

            //Обращаемся к юзер-сервису функции login для логинизации нашего пользователя
            const userData = await UserService.login(email, password);

            //Помещаем refreshToken в cookie и задаем ему параметры жизни 30 дней и флаг,
            //который не позволяет изменять куку на стороне клиента с помощью JS
            res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

            //Отправляем данные на сервер со статусом 200 и данными полученными из сервиса
            return res.status(200).json(userData);
        }catch (e){
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
            return res.status(200).json({"message":"Пользователь вышел из профиля", resultCode:0});
        }catch (e){
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
        }catch (e){
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
            res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

            //Отправляем данные на сервер со статусом 200 и данными полученными из сервиса
            return res.status(200).json(userData);
        }catch (e){
            next(e);
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json(users);
        }catch (e){
            next(e);
        }
    }

}

module.exports = new UserController();