require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./db');
const router = require("./routes/index");
const corsOptions = {
    origin:'http://localhost:3000',
    credentials:true,
    optionsSuccessStatus: 200
}

const PORT = process.env.PORT || 4000;


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api', router);

const startApp = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, ()=> {console.log(`Сервер запущен на порту ${PORT}`)})
    }
    catch (error){
        console.log(error);
    }
}

startApp();