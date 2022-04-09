import React, {useContext, useState} from 'react';
import classes from "./FormAdminComponents.module.css";
import {Context} from "../../../index";
import {observer} from 'mobx-react-lite';
import SmallLoading from "../../SmallLoading/SmallLoading";
import MyInput from "../../MyInput/MyInput";
import MyButton from "../../MyButton/MyButton";

const AddNode = () => {
    const {store} = useContext(Context);

    const [nameNode, setNameNode] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [port, setPort] = useState('');
    const [errorName, setErrorName] = useState(false);
    const [errorIp, setErrorIp] = useState(false);
    const [errorPort, setErrorPort] = useState(true);

    const onChangeNameNode = (event) => {
        setNameNode(event.target.value);
        if (event.target.value === "") {
            setErrorName(false);
        } else {
            setErrorName(true);
        }
    }

    const onChangeIpAddress = (event) => {
        setIpAddress(event.target.value);

        const reg = /^(https?:\/\/)(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        if (!reg.test(String(event.target.value).toLowerCase())) setErrorIp(false);
        else setErrorIp(true);
    }

    const onChangePort = (event) => {
        setPort(event.target.value);

        const reg = /^[\d]*$/;

        if (!reg.test(String(event.target.value).toLowerCase())) setErrorPort(false);
        else setErrorPort(true);
    }

    const addNewNodeDB = (event) => {
        event.preventDefault();
        store.setLoading(true);
        store.addNewNode(nameNode, ipAddress, port)
            .then(res => {
                console.log(res);
                store.setLoading(false);
            })
        setNameNode('');
        setIpAddress('');
        setPort('');
        setErrorPort(true);
        setErrorName(false);
        setErrorIp(false);
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>Добавить узел</div>
            {store.isLoading
                ? <SmallLoading/>
                : null}
            <form>
                <MyInput
                    label="Имя узла:"
                    autoFocus
                    type="text"
                    name='nameNode'
                    autoComplete='off'
                    onChange={onChangeNameNode}
                    value={nameNode}
                    placeholder="Введите наименование узла"
                />
                <MyInput
                    label="IP адрес:"
                    type="text"
                    name='ipAddress'
                    autoComplete='off'
                    onChange={onChangeIpAddress}
                    value={ipAddress}
                    placeholder="Введите адрес http://"
                />
                <MyInput
                    label="Номер порта:"
                    type="text"
                    name='port'
                    autoComplete='off'
                    onChange={onChangePort}
                    value={port}
                    placeholder="Введите номер порта"
                />
                <div className={classes.submitAddNode}>
                    <MyButton
                        disabled={!errorName || !errorIp || !errorPort}
                        onClick={addNewNodeDB}
                    >Создать узел
                    </MyButton>
                </div>
            </form>
        </div>
    );
};

export default observer(AddNode);