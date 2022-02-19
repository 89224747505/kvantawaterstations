const jwt = require('jsonwebtoken');
const {User} = require("../models/models");

//authMiddleware - ответ req.user

module.exports = function (req, res, next) {
    //Если метод запроса OPTIONS, то прерываем выполнение и передаем дальше по цепочке выполнения программы
    if (req.method === "OPTIONS") next();

    try {
        if (!req.headers.authorization) return res.status(401).json({message: "В заголовке нет ACCESS JWT Token"});
        //Достаем из Хедеров код авторизации jwt
        const token = req.headers.authorization.split(' ')[1];

        //Если кода jwt нет выдаем ошибку авторизации
        if (!token) return res.status(401).json({message: "Пользователь не авторизован"});

        //Декодируем и проверяем токен
        jwt.verify(token,process.env.ACCESS_TOKEN, (err, decoded) => {

            //Ecли ошибка, то выдаем в сообщении невалидный токен
            if (err) return res.status(401).json({message: "У пользователя невалидный токен"});

            //
            if (!decoded.isActivated) return res.status(401).json({message: "У пользователя неактивирован аккаунт"});

            //Передаем данные из декодированного токена в req и вызываем функцию next
            req.user = decoded;
        });

        next();
    }catch (e){
        return res.status(500).json({message: "Ошибка сервера. Проверьте соединение"})
    }
}