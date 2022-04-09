import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import classes from "../LoginForm/LoginForm.module.css";
import {Context} from "../../index";

const SmsForm = () => {
    const {store} = useContext(Context);

    const [smsMessage, setSmsMessage] = useState('');
    const [smsDirty, setSmsDirty] = useState(false);
    const [smsError, setSmsError] = useState(false);

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

    const clickSmsMessageSend = () => {
        if (smsError || smsDirty) {
            store.setMessage("Введите код из СМС корректно");
            return;
        }
        store.setLoading(true);
        store.setSms(false);
        store.login(store.candidateEmail,store.candidatePassword, smsMessage)
            .then(response => {
                    if (response.message) {
                        store.setMessage(response.message);
                        store.setAuth(false);
                        store.setLoading(false);
                    }
                    if (response.data.user.isActivated) {
                        localStorage.setItem('AccessJwt', response.data.accessToken);
                        store.setAuth(true);
                        store.setSms(false);
                        if (response.data.user.role === 'ADMIN') store.setAdmin(true);
                        store.setUser(response.data.user);
                        store.setLoading(false);
                    } else store.setMessage("Активируйте аккаунт");;
                }
            );
    }


    const blurHandler = (event) => {
        if (event.target.name === 'sms') (smsMessage === '') ? setSmsDirty(true) : setSmsDirty(false);
    }

        return (
            <div className={classes.wrapper}>
            <div className={classes.loginForm}>
                <div className={classes.logo}>
                    <img src="https://www.kvantashop.ru/bitrix/templates/prohome/img/kvanta-logo.png" alt=""/>
                </div>
                <form>
                    <div className={classes.flexRow}>
                        <input
                            onBlur={blurHandler}
                            autoFocus={true}
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
                </form>
                <div className={classes.wrapperMessage}><div className={classes.message} >{store.message}</div></div>
            </div>
</div>
        );
};


export default observer(SmsForm);