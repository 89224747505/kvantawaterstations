import { observer } from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Context} from "../../index";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onChangeEmail = (event) => setEmail(event.target.value);

    const onChangePassword = (event) => setPassword(event.target.value);

    const clickLogin = () => store.login(email, password);

    const clickRegistration = () => store.registration(email,password);

    const {store} = useContext(Context);
    return (
        <div>
            <h1>{store.message}</h1>
            <div>
                <input
                    onChange={onChangeEmail}
                    value={email}
                    type="text"
                    placeholder="Введите e-mail"
                />
            </div>
            <div>
                <input
                    onChange={onChangePassword}
                    value={password}
                    type="password"
                    placeholder="Введите пароль"
                />
            </div>
            <div>
                <button onClick={clickLogin}>Логин</button>
                <button onClick={clickRegistration}>Регистрация</button>
            </div>
        </div>
    );
};

export default observer(LoginForm);