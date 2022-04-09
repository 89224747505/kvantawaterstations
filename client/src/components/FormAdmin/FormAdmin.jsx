import React, {useContext, useEffect, useState} from 'react';
import classes from "./FormAdmin.module.css";
import MenuButton from "../MenuButton/MenuButton";
import addWater from "../../img/addwater.svg";
import addWaterHover from "../../img/addwaterhover.svg";
import deleteWater from "../../img/deletewater.svg";
import deleteWaterHover from "../../img/deletewaterhover.svg";
import profile from "../../img/profile.svg";
import profileHover from "../../img/profilehover.svg";
import deleteImgProfile from "../../img/deleteprofile.svg";
import deleteImgProfileHover from "../../img/deleteprofilehover.svg";
import changeImgProfile from "../../img/changeprofile.svg";
import changeImgProfileHover from "../../img/changeprofilehover.svg";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import AddNode from "./FormComponents/AddNode";
import DeleteNode from "./FormComponents/DeleteNode";
import AddProfile from "./FormComponents/AddProfile";
import DeleteProfile from "./FormComponents/DeleteProfile";
import ChangeProfile from "./FormComponents/ChangeProfile";

const FormAdmin = () => {
    const {store} = useContext(Context);
    const [addNode, setAddNode] = useState(true);
    const [deleteNode, setDeleteNode] = useState(false);
    const [addProfile, setAddProfile] = useState(false);
    const [deleteProfile, setDeleteProfile] = useState(false);
    const [changeProfile, setChangeProfile] = useState(false);

    useEffect(() => {
        store.setScreenWH(window.innerWidth, window.innerHeight);
        store.getNodes()
            .then(response =>{
                store.setAllNodes(response.data);
            });
        store.getUsers()
            .then(response => {
                store.setUsers(response.data);
            })
    });

    const clearAllForms = () => {
        setAddNode(false);
        setDeleteNode(false);
        setAddProfile(false);
        setDeleteProfile(false);
        setChangeProfile(false);
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.menu}>
                <div>
                    <MenuButton
                        text={store.screenWidth > 1000 ? "Добавить узел" : ""}
                        background={true}
                        src={addWater}
                        srcHover={addWaterHover}
                        onClick={() => {
                            clearAllForms();
                            setAddNode(true)
                        }}
                        alt="Добавить узел"
                        title="Добавить новый узел в БД"
                    />
                </div>
                <hr/>
                <div>
                    <MenuButton
                        text={store.screenWidth > 1000 ? "Удалить узел" : ""}
                        background={true}
                        src={deleteWater}
                        srcHover={deleteWaterHover}
                        onClick={() => {
                            clearAllForms();
                            setDeleteNode(true)
                        }}
                        alt="Удалить узел"
                        title="Удалить узел из БД"
                    />
                </div>
                <hr/>
                <div>
                    <MenuButton
                        text={store.screenWidth > 1000 ? "Добавить профиль" : ""}
                        background={true}
                        src={profile}
                        srcHover={profileHover}
                        onClick={() => {
                            clearAllForms();
                            setAddProfile(true)
                        }}
                        alt="Добавить профиль"
                        title="Добавить профиль"
                    />
                </div>
                <hr/>
                <div>
                    <MenuButton
                        text={store.screenWidth > 1000 ? "Удалить профиль" : ""}
                        background={true}
                        src={deleteImgProfile}
                        srcHover={deleteImgProfileHover}
                        onClick={() => {
                            clearAllForms();
                            setDeleteProfile(true)
                        }}
                        alt="Удалить профиль"
                        title="Удалить профиль"
                    />
                </div>
                <hr/>
                <div>
                    <MenuButton
                        text={store.screenWidth > 1000 ? "Редактировать профиль" : ""}
                        background={true}
                        src={changeImgProfile}
                        srcHover={changeImgProfileHover}
                        onClick={() => {
                            clearAllForms();
                            setChangeProfile(true)
                        }}
                        alt="Редактировать профиль"
                        title="Редактировать профиль"
                    />
                </div>
            </div>
            <div className={classes.contentAdmin}>
                {addNode ? <AddNode/> : null}
                {deleteNode ? <DeleteNode/> : null}
                {addProfile ? <AddProfile/> : null}
                {deleteProfile ? <DeleteProfile/> : null}
                {changeProfile ? <ChangeProfile/> : null}
            </div>
        </div>
    );
};

export default observer(FormAdmin);