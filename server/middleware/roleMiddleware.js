const jwt = require("jsonwebtoken");

//roleMiddleware(["USER","ADMIN","EDITOR","AUTHOR"]) - ответа нет, просто пропускает дальше

module.exports = (roles) => (req, res, next) => {

    //Если метод запроса OPTIONS, то прерываем выполнение и передаем дальше по цепочке выполнения программы
    if (req.method === "OPTIONS") next();

    try {

        //Достаем из Хедеров код авторизации jwt
        const token = req.headers.authorization.split(' ')[1];

        //Если кода jwt нет выдаем ошибку авторизации
        if (!token) return res.status(401).json({message: "Пользователь не авторизован"});

        //Декодируем и проверяем токен
        let userRole;

        jwt.verify(token,process.env.ACCESS_TOKEN,(err, decoded) => {

            if (err) res.status(403).json({message: "У пользователя невалидный токен"});

            userRole = decoded.role;
        });

        //Если при проверке массива ролей переданного нам с функцией не будет совпадения с ролью пользователя, то запретить доступ
        if (!roles.includes(userRole)) return res.status(403).json({message: "Пользователю запрещен доступ"});

        next();
    }catch (e){
        return res.status(500).json({message: "Ошибка сервера. Проверьте соединение"})
    }
}