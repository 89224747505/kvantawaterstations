import React, {useContext} from 'react';
import classes from "./Menu.module.css";
import {Context} from "../../index";
import {observer} from 'mobx-react-lite';
import exit from '../../img/exit.svg';
import exitHover from '../../img/exithover.svg';
import settings from '../../img/settings.svg';
import settingsHover from '../../img/settingshover.svg';
import MenuButton from "../MenuButton/MenuButton";

const Menu = () => {
    const {store} = useContext(Context);
        return (
            <div className={classes.menu}>
                <div className={classes.btn}>
                    <MenuButton
                        background={true}
                        src={exit}
                        srcHover={exitHover}
                        onClick={() => {store.logout()}}
                        alt="Выход"
                        title="Выход из аккаунта"
                    />
                </div>

                {store.isAdmin ? <div className={classes.btn}>
                    <MenuButton
                        background={true}
                        src={settings}
                        srcHover={settingsHover}
                        onClick={()=>store.setFormAdminProp(!store.isFormAdminProp)}
                        alt="Настройки"
                        title="Настройки администратора"
                    />
                </div> : null}

            </div>
        );
};

export default observer(Menu);