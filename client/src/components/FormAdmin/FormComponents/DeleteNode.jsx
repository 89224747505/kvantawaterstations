import React, {useContext, useEffect, useState} from 'react';
import classes from "./FormAdminComponents.module.css";
import {Context} from "../../../index";
import {observer} from 'mobx-react-lite';
import SmallLoading from "../../SmallLoading/SmallLoading";
import MyButton from "../../MyButton/MyButton";
import MySelect from "../../MySelect/MySelect";

const DeleteNode = () => {
    const {store} = useContext(Context);
    const [checkAllow, setCheckAllow] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');

    useEffect(() => {
        store.getNodes()
            .then(response =>{
                store.setAllNodes(response.data);
            })
    },[])

    const deleteNodeFromDB = () => {
        store.setLoading(true);
        store.deleteNode(selectedValue)
            .then(response => {
                store.setLoading(false);
                store.getNodes()
                    .then(response =>{
                        store.setAllNodes(response.data);
                    })
                setCheckAllow(false);
            })
    };

    const changeCheckBox = () => setCheckAllow(!checkAllow);

    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>Удалить узел</div>

            {store.isLoading
                ? <SmallLoading/>
                : null}

            <MySelect
                name="elementForDelete"
                size="17"
                value={selectedValue}
                onChange={(e)=>setSelectedValue(e.target.value)}
            >
                {store.allNodes.map(value =>
                    <option
                        title={`${value.nameNode} ${value.ipAddress}`}
                        value={value.id}
                        key={value.id}
                    >{value.nameNode} ► {value.ipAddress}</option>)}
            </MySelect>

            <div className={classes.checkBox}>
                <input type="checkbox" checked={checkAllow} onChange={changeCheckBox}/>
                <div>Я подтверждаю удаление узла из базы данных</div>
            </div>

            <div className={classes.submitAddNode}>
                <MyButton
                    disabled={!checkAllow}
                    onClick={deleteNodeFromDB}
                >Удалить узел
                </MyButton>
            </div>
        </div>
    );
};

export default observer(DeleteNode);