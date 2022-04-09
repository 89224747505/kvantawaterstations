import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../../index";
import {observer} from 'mobx-react-lite';
import classes from "./FormAdminComponents.module.css";
import SmallLoading from "../../SmallLoading/SmallLoading";
import MySelect from "../../MySelect/MySelect";
import MyButton from "../../MyButton/MyButton";

const DeleteProfile = () => {
    const {store} = useContext(Context);
    const [checkAllow, setCheckAllow] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');

    useEffect(() => {
        store.getUsers()
            .then(response => {
                store.setUsers(response.data);
                console.log(response.data)
            })
    },[])

    const deleteUserFromDB = () => {
        store.setLoading(true);
        store.deleteUser(selectedValue)
            .then(response => {
                store.setLoading(false);
                store.getUsers()
                    .then(response => {
                        store.setUsers(response.data);
                    })
                setCheckAllow(false);
            })
    };

    const changeCheckBox = () => setCheckAllow(!checkAllow);

    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>Удалить профиль</div>

            {store.isLoading
                ? <SmallLoading/>
                : null}

            <MySelect
                name="elementForDelete"
                size="17"
                value={selectedValue}
                onChange={(e)=>setSelectedValue(e.target.value)}
            >
                {store.users.map(value =>
                    <option
                        title={`${value.role} ► ${value.email} ${value.phone}`}
                        value={value.id}
                        key={value.id}
                    >{value.email} ► {value.role} {value.phone}</option>)}
            </MySelect>

            <div className={classes.checkBox}>
                <input type="checkbox" checked={checkAllow} onChange={changeCheckBox}/>
                <div>Я подтверждаю удаление профиля из базы данных</div>
            </div>

            <div className={classes.submitAddNode}>
                <MyButton
                    disabled={!checkAllow}
                    onClick={deleteUserFromDB}
                >Удалить узел
                </MyButton>
            </div>
        </div>
    );
};

export default observer(DeleteProfile);