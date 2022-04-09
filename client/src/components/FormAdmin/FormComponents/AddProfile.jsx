import React, {useContext, useEffect, useState} from 'react';
import classes from "./FormAdminComponents.module.css";
import {Context} from "../../../index";
import {observer} from 'mobx-react-lite';
import SmallLoading from "../../SmallLoading/SmallLoading";
import MyInput from "../../MyInput/MyInput";
import MyButton from "../../MyButton/MyButton";
import MySelect from "../../MySelect/MySelect";

const AddProfile = () => {
    const {store} = useContext(Context);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('USER');
    const [selectedValueLeft, setSelectedValueLeft] = useState('0');
    const [selectedValueRight, setSelectedValueRight] = useState('');
    const [rightNodesArray, setRightNodesArray] = useState([]);
    const [leftNodesArray, setLeftNodesArray] = useState([]);

    const [isActivated, setIsActivated] = useState(false);
    const [emailDirty, setEmailDirty] = useState(false);
    const [passwordDirty, setPasswordDirty] = useState(false);
    const [phoneDirty, setPhoneDirty] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    useEffect(() => {
        store.getNodes()
            .then(response => {
                setLeftNodesArray(response.data);
            })
    }, [])

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

    const onChangePassword = (event) => {
        setPassword(event.target.value);
        if (event.target.value.length < 6) {
            setPasswordError(true)
        } else {
            setPasswordDirty(false);
            setPasswordError(false);
        }
    }

    const onChangeRole = (event) => setRole(event.target.value);

    const onChangeIsActivated = () => setIsActivated(!isActivated);

    const registrationNewProfile = (event) => {
        event.preventDefault();
        if (emailError || emailDirty || passwordError || passwordDirty || phoneError || phoneDirty) return;

        let allowFrames = '';
        for (let item of rightNodesArray)
            allowFrames += item.id+'/';
        allowFrames = allowFrames.slice(0, allowFrames.length-1);
        store.setLoading(true);
        store.createNewProfileAdmin(email, phone, password, role, isActivated, allowFrames)
            .then(response => {
                store.setLoading(false);
                setEmail('');
                setPhone('');
                setPassword('');
                setIsActivated(false);
                setRole('USER');
                store.getNodes()
                    .then(response => {
                        setLeftNodesArray(response.data);
                    })
                setRightNodesArray([]);
            });
    }

    const addNodeToArray = () => {
        if (leftNodesArray.length === 0) return

        const arr = rightNodesArray;
        arr.push(leftNodesArray[selectedValueLeft]);
        setRightNodesArray(arr);
        setSelectedValueRight('0');
        setSelectedValueLeft('0');
        setLeftNodesArray(leftNodesArray.filter((value, index)=> index !== Number(selectedValueLeft)));
    }

    const deleteNodeFromArray = () => {
        if (rightNodesArray.length === 0) return

        const arr = leftNodesArray;
        arr.push(rightNodesArray[selectedValueRight]);
        setLeftNodesArray(arr);
        setSelectedValueRight('0');
        setSelectedValueLeft('0');
        setRightNodesArray(rightNodesArray.filter((value, index)=> index !== Number(selectedValueRight)));
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
        }
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>Добавить профиль</div>
            {store.isLoading
                ? <SmallLoading/>
                : null}
            <form className={classes.form}>
                <div className={classes.inputPB}>
                    <MyInput
                        className={emailDirty || emailError ? classes.redBorder : null}
                        onBlur={blurHandler}
                        autoFocus
                        type="text"
                        name='email'
                        autoComplete='off'
                        onChange={onChangeEmail}
                        onKeyDown={(e) => e.key === 'Enter' ? registrationNewProfile() : null}
                        value={email}
                        placeholder="Введите e-mail*"
                    />
                </div>
                <div className={classes.inputPB}>
                    <MyInput
                        className={phoneDirty || phoneError ? classes.redBorder : null}
                        onBlur={blurHandler}
                        type="text"
                        name='phone'
                        autoComplete='off'
                        onKeyDown={(e) => e.key === 'Enter' ? registrationNewProfile() : null}
                        onChange={onChangePhone}
                        value={phone}
                        placeholder="Введите телефон +79991112233*"
                    />
                </div>
                <div className={classes.inputPB}>
                    <MyInput
                        className={passwordDirty || passwordError ? classes.redBorder : null}
                        onBlur={blurHandler}
                        type="text"
                        name='password'
                        autoComplete='off'
                        onKeyDown={(e) => e.key === 'Enter' ? registrationNewProfile() : null}
                        onChange={onChangePassword}
                        value={password}
                        placeholder="Введите пароль*"
                    />
                </div>
                <MySelect
                    allBorder={true}
                    name="role"
                    size="1"
                    value={role}
                    onChange={onChangeRole}
                >
                    <option value="USER" title="Пользователь">Пользователь</option>
                    <option value="ADMIN" title="Администратор">Администратор</option>
                </MySelect>
                <div className={`${classes.checkBox} ${classes.checkBoxPB}`}>
                    <input type="checkbox" checked={isActivated} onChange={onChangeIsActivated}/>
                    <div>Активировать аккаунт</div>
                </div>
                <div className={classes.addNodes}>Добавить в профиль узлы:</div>
                <div className={classes.wrapSelectNodes}>
                    <div>
                        <MySelect
                            widthAll={true}
                            name="elementLeft"
                            size="6"
                            value={selectedValueLeft}
                            onBlur={(e) => setSelectedValueLeft(e.target.value)}
                            onChange={(e) => setSelectedValueLeft(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' ? addNodeToArray() : null}
                        >
                            {leftNodesArray.map((value, index)=>
                                <option
                                    title={`${value.nameNode} ${value.ipAddress}`}
                                    value={index}
                                    key={value.id}
                                >{value.nameNode}</option>)}
                        </MySelect>
                    </div>
                    <div className={classes.btnsAddDelete}>
                        <div className={classes.btnFromLeft} onClick={addNodeToArray}>→</div>
                        <div className={classes.btnFromRight} onClick={deleteNodeFromArray}>←</div>
                    </div>
                    <div>
                        <MySelect
                            widthAll={true}
                            name="elementRight"
                            size="6"
                            value={selectedValueRight}
                            onBlur={(e) => setSelectedValueRight(e.target.value)}
                            onChange={(e) => setSelectedValueRight(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' ? deleteNodeFromArray() : null}
                        >
                            {rightNodesArray.map((value, index) =>
                                <option
                                    title={`${value.nameNode} ${value.ipAddress}`}
                                    value={index}
                                    key={value.id}
                                >{value.nameNode}</option>)}
                        </MySelect>
                    </div>
                </div>
                <div className={classes.submitAddNode}>
                    <MyButton
                        onClick={registrationNewProfile}
                    >Создать узел
                    </MyButton>
                </div>
            </form>
        </div>
    );
};


export default observer(AddProfile);