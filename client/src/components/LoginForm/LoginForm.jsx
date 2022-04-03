import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Context} from "../../index";
import classes from "./LoginForm.module.css";

const LoginForm = () => {
    const {store} = useContext(Context);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [smsMessage, setSmsMessage] = useState('');
    const [checkReg, setCheckReg] = useState(false);
    const [phone, setPhone] = useState('');
    const [emailDirty, setEmailDirty] = useState(false);
    const [passwordDirty, setPasswordDirty] = useState(false);
    const [phoneDirty, setPhoneDirty] = useState(false);
    const [smsDirty, setSmsDirty] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [smsError, setSmsError] = useState(false);


    const onChangeEmail = (event) => {
        setEmail(event.target.value);
        const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!reg.test(String(event.target.value).toLowerCase())) {
            setEmailError(true);
        } else {
            setEmailDirty(false);
            setEmailError(false);
        }
    }

    const onChangePassword = (event) => {
        setPassword(event.target.value);
        if (event.target.value.length < 4) {
            setPasswordError(true)
        }else {
            setPasswordDirty(false);
            setPasswordError(false);
        }
    }

    const onChangeSmsMessage = (event) => {
        setSmsMessage(event.target.value);
        const reg = /\d{6}/;
        if (!reg.test(String(event.target.value))) {
            setSmsError(true);
        } else {
            setSmsError(false);
            setSmsDirty(false);
        }

    }

    const onChangePhone = (event) => {
        setPhone(event.target.value);
        const reg = /^(\+7)\d{10}/;
        if (!reg.test(String(event.target.value))) {
            setPhoneError(true);
        } else {
            setPhoneError(false);
            setPhoneDirty(false);
        }

    }

    const changeCheckBox = () => setCheckReg(!checkReg);

    const clickLogin = () => {
        if (emailError || emailDirty || passwordError || passwordDirty) {
            store.setMessage("Введите данные формы корректно");
            return;
        }
        store.login(email, password);
        store.setMessage('');
    }

    const clickRegistration = () => {
        if (emailError || emailDirty || passwordError || passwordDirty || phoneError || phoneDirty) {
            store.setMessage("Введите данные формы корректно");
            return;
        }
        store.registration(email, password, phone);
        setCheckReg(false);
        store.setMessage('');
    }

    const clickSmsMessageSend = () => {
        if (smsError || smsDirty) {
            store.setMessage("Введите код из СМС корректно");
            return;
        }
        store.login(email,password, smsMessage);
        setEmail('');
        setPassword('');
        setSmsMessage('');
    }


    const blurHandler = (event) => {
        switch (event.target.name) {
            case 'email':
                (email === '') ? setEmailDirty(true) : setEmailDirty(false);
                break;
            case 'phone':
                (phone === '') ? setPhoneDirty(true) : setPhoneDirty(false);
                break;
            case 'password':
                (password === '') ? setPasswordDirty(true) : setPasswordDirty(false);
                break;
            case 'sms':
                (smsMessage === '') ? setSmsDirty(true) : setSmsDirty(false);
                break;
        }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (checkReg) {
        return (
            <div className={classes.loginForm}>
                <div className={classes.logo}>
                    <img src="https://www.kvantashop.ru/bitrix/templates/prohome/img/kvanta-logo.png" alt=""/>
                </div>
                <div className={classes.flexRow}>
                    <input
                        autoFocus
                        onBlur={blurHandler}
                        name='email'
                        autoComplete='off'
                        className={emailDirty || emailError ? `${classes.lfInput} ${classes.redBorder}` :classes.lfInput}
                        onChange={onChangeEmail}
                        onKeyDown={(e) => e.key === 'Enter' ? clickRegistration() : null}
                        value={email}
                        type="text"
                        placeholder="Введите e-mail*"
                    />
                </div>
                <div className={classes.flexRow}>
                    <input
                        onBlur={blurHandler}
                        name='phone'
                        autoComplete='off'
                        className={phoneDirty || phoneError ? `${classes.lfInput} ${classes.redBorder}` :classes.lfInput}
                        onChange={onChangePhone}
                        onKeyDown={(e) => e.key === 'Enter' ? clickRegistration() : null}
                        value={phone}
                        type="text"
                        placeholder="Номер телефона +79991112233*"
                    />
                </div>
                <div className={classes.flexRow}>
                    <input
                        onBlur={blurHandler}
                        name='password'
                        autoComplete='off'
                        className={passwordDirty || passwordError ? `${classes.lfInput} ${classes.redBorder}` :classes.lfInput}
                        onChange={onChangePassword}
                        onKeyDown={(e) => e.key === 'Enter' ? clickRegistration() : null}
                        value={password}
                        type="text"
                        placeholder="Введите пароль*"
                    />
                </div>
                <div className={classes.lForgot}>
                    <input type="checkbox" checked={checkReg} onChange={changeCheckBox}/>
                    <label>Зарегистрировать нового пользователя</label>
                </div>
                <div>
                    <button className={classes.lfSubmit} onClick={clickRegistration}>Регистрация</button>
                </div>
                <div className={classes.wrapperMessage}><div className={classes.message} >{store.message}</div></div>
            </div>
        );
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (store.isSms) {
        return (
          <div className={classes.loginForm}>
              <div className={classes.logo}>
                  <img src="https://www.kvantashop.ru/bitrix/templates/prohome/img/kvanta-logo.png" alt=""/>
              </div>
              <div className={classes.flexRow}>
                  <input
                      onBlur={blurHandler}
                      autoComplete='off'
                      name='sms'
                      className={smsDirty || smsError ? `${classes.lfInput} ${classes.redBorder}` :classes.lfInput}
                      onChange={onChangeSmsMessage}
                      onKeyDown={(e) => e.key === 'Enter' ? clickSmsMessageSend() : null}
                      value={smsMessage}
                      type="text"
                      placeholder="Код из СМС-сообщения"
                  />
              </div>
              <div>
                  <button className={classes.lfSubmit} onClick={clickSmsMessageSend}>Отправить код</button>
              </div>
              <div className={classes.wrapperMessage}><div className={classes.message} >{store.message}</div></div>
          </div>
        );
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (!store.isSms && !checkReg) {
        return (
            <div className={classes.loginForm}>
                <div className={classes.logo}>
                    <img src="https://www.kvantashop.ru/bitrix/templates/prohome/img/kvanta-logo.png" alt=""/>
                </div>
                <div className={classes.flexRow}>
                    <input
                        autoFocus
                        onBlur={blurHandler}
                        name='email'
                        autoComplete='off'
                        className={emailDirty || emailError ? `${classes.lfInput} ${classes.redBorder}` :classes.lfInput}
                        onKeyDown={(e) => e.key === 'Enter' ? clickLogin() : null}
                        onChange={onChangeEmail}
                        value={email}
                        type="text"
                        placeholder="E-mail"
                    />
                </div>
                <div className={classes.flexRow}>
                    <input
                        onBlur={blurHandler}
                        autoComplete='off'
                        name='password'
                        className={passwordDirty || passwordError ? `${classes.lfInput} ${classes.redBorder}` :classes.lfInput}
                        onKeyDown={(e) => e.key === 'Enter' ? clickLogin() : null}
                        onChange={onChangePassword}
                        value={password}
                        type="password"
                        placeholder="Пароль"
                    />
                </div>
                <div className={classes.lForgot}>
                    <input type="checkbox" checked={checkReg} onChange={changeCheckBox}/>
                    <label>Зарегистрировать нового пользователя</label>
                </div>
                <div>
                    <button className={classes.lfSubmit} onClick={clickLogin}>Логин</button>
                </div>
                <div className={classes.wrapperMessage}><div className={classes.message} >{store.message}</div></div>
            </div>
        );
    };
};

export default observer(LoginForm);