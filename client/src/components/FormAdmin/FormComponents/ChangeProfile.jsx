import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../../index";
import classes from "./FormAdminComponents.module.css";
import {observer} from 'mobx-react-lite';
import MySelect from "../../MySelect/MySelect";
import MyButton from "../../MyButton/MyButton";
import SmallLoading from "../../SmallLoading/SmallLoading";
import MyInput from "../../MyInput/MyInput";

const ChangeProfile = () => {
    const {store} = useContext(Context);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [selectedValue, setSelectedValue] = useState('0');
    const [switcher, setSwitcher] = useState(false);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [selectedValueLeft, setSelectedValueLeft] = useState('0');
    const [selectedValueRight, setSelectedValueRight] = useState('0');
    const [rightNodesArray, setRightNodesArray] = useState([]);
    const [leftNodesArray, setLeftNodesArray] = useState([]);
    const [isActivated, setIsActivated] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        store.getUsers()
            .then(response => {
                store.setUsers(response.data);
            })
    }, [])

    const transmitUserToForm = () => {
        setId(store.users[selectedValue].id)
        setEmail(store.users[selectedValue].email);
        setPhone(store.users[selectedValue].phone);
        setIsActivated(store.users[selectedValue].isActivated);
        setRole(store.users[selectedValue].role);
        setSwitcher(true);
        store.getNodes()
            .then(response => {
                const nodes = store.users[selectedValue].allowFrames.split('/');
                const arrRight = response.data.filter(item => {
                    for (let i of nodes)
                        if (Number(i) === item.id) return true;
                    return false;
                })
                setRightNodesArray(arrRight);
                const arrLeft = response.data.filter(item => {
                    for (let i of nodes)
                        if (Number(i) === item.id) return false;
                    return true;
                })
                setLeftNodesArray(arrLeft);
            })
    };

    const onChangeEmail = (event) => {
        setEmail(event.target.value);
        const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!reg.test(String(event.target.value).toLowerCase())) setEmailError(true);
        else setEmailError(false);

    }

    const onChangePhone = (event) => {
        setPhone(event.target.value);
        const reg = /^(\+7)\d{10}/;
        if (!reg.test(String(event.target.value))) setPhoneError(true);
        else setPhoneError(false);
    }

    const onChangePassword = (event) => {
        setPassword(event.target.value);
        if (event.target.value.length < 6) setPasswordError(true)
        else setPasswordError(false);
        if (event.target.value.length === 0) setPasswordError(false);
    }

    const onChangeRole = (event) => setRole(event.target.value);

    const onChangeIsActivated = () => setIsActivated(!isActivated);

    const updateProfile = (event) => {
        event.preventDefault();
        if (emailError || passwordError || phoneError) return;

        let allowFrames = '';
        for (let item of rightNodesArray)
            allowFrames += item.id + '/';
        allowFrames = allowFrames.slice(0, allowFrames.length - 1);
        store.setLoading(true);

        store.updateUserProfile(id,email, phone, password, role, isActivated, allowFrames)
            .then(response => {
                store.setLoading(false);
                store.getUsers()
                    .then(response => {
                        store.setUsers(response.data);
                    })
                setSwitcher(false);
            });
    }

    const addNodeToArray = () => {
        if (leftNodesArray.length === 0) return

        const arr = rightNodesArray;
        arr.push(leftNodesArray[selectedValueLeft]);
        setRightNodesArray(arr);
        setSelectedValueRight('0');
        setSelectedValueLeft('0');
        setLeftNodesArray(leftNodesArray.filter((value, index) => index !== Number(selectedValueLeft)));
    }

    const deleteNodeFromArray = () => {
        if (rightNodesArray.length === 0) return

        const arr = leftNodesArray;
        arr.push(rightNodesArray[selectedValueRight]);
        setLeftNodesArray(arr);
        setSelectedValueRight('0');
        setSelectedValueLeft('0');
        setRightNodesArray(rightNodesArray.filter((value, index) => index !== Number(selectedValueRight)));
    }

    if (!switcher) {
        return (
            <div className={classes.wrapper}>
                <div className={classes.title}>Редактировать профиль</div>
                <MySelect
                    name="elementForDelete"
                    size="17"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                >
                    {store.users.map((value, index) =>
                        <option
                            title={`${value.role} ► ${value.email} ${value.phone}`}
                            value={index}
                            key={value.id}
                        >{value.email} ► {value.role} {value.phone}</option>)}
                </MySelect>

                <div className={classes.submitAddNode}>
                    <MyButton
                        onClick={transmitUserToForm}
                    >Редактировать
                    </MyButton>
                </div>
            </div>
        );
    } else {
        return (
            <div className={classes.wrapper}>
                <div className={classes.title}>Редактировать профиль</div>
                {store.isLoading
                    ? <SmallLoading/>
                    : null}
                <form>
                    <div className={classes.inputPB}>
                        <MyInput
                            className={emailError ? classes.redBorder : null}
                            autoFocus
                            type="text"
                            name='email'
                            autoComplete='off'
                            onChange={onChangeEmail}
                            onKeyDown={(e) => e.key === 'Enter' ? updateProfile() : null}
                            value={email}
                            placeholder="Введите e-mail*"
                        />
                    </div>
                    <div className={classes.inputPB}>
                        <MyInput
                            className={phoneError ? classes.redBorder : null}
                            type="text"
                            name='phone'
                            autoComplete='off'
                            onKeyDown={(e) => e.key === 'Enter' ? updateProfile() : null}
                            onChange={onChangePhone}
                            value={phone}
                            placeholder="Введите телефон +79991112233*"
                        />
                    </div>
                    <div className={classes.inputPB}>
                        <MyInput
                            className={passwordError ? classes.redBorder : null}
                            type="text"
                            name='password'
                            autoComplete='off'
                            onKeyDown={(e) => e.key === 'Enter' ? updateProfile() : null}
                            onChange={onChangePassword}
                            value={password}
                            placeholder="*[Пароль оставить прежним]*"
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
                                onKeyDown={(e) => (e.key === 'Enter') || (e.key === 'ArrowRight') ? addNodeToArray() : null}
                            >
                                {leftNodesArray.map((value, index) =>
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
                                onKeyDown={(e) => (e.key === 'Enter') || (e.key === 'ArrowLeft') ? deleteNodeFromArray() : null}
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
                            disabled={emailError || passwordError || phoneError || email === '' || phone === ''}
                            onClick={updateProfile}
                        >Редактировать
                        </MyButton>
                    </div>
                </form>
            </div>
        );
    }
};

export default observer(ChangeProfile);