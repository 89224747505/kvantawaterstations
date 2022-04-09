import React, {useContext, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Context} from "../../index";
import Menu from "../Menu/Menu";
import classes from "./MainComponent.module.css";
import FormAdmin from "../FormAdmin/FormAdmin";
import MenuButton from "../MenuButton/MenuButton";
import close from "../../img/close.svg";
import closeHover from "../../img/closehover.svg";

const MainComponent = () => {
    const {store} = useContext(Context);

    return (
        <div className={classes.wrapper}>
            <Menu/>

            {//Вывод формы выбранного узла
                store.isFormCurrentNode
                    ? <div className={classes.form}>
                        <iframe className={classes.frameWaterClean} src="http://10.10.31.2:8080" frameBorder="0">Узел не
                            доступен
                        </iframe>
                    </div> : null}
            {//Вывод формы НАСТРОЙКИ АДМИНИСТРАТОРА
                store.isFormAdminProp
                    ? <div className={classes.form}>
                        <div className={classes.headerForm}>
                            <div className={classes.titleForm}>Настройки администратора</div>
                            <MenuButton
                                src={close}
                                srcHover={closeHover}
                                onClick={() => store.setFormAdminProp(false)}
                                alt="Закрыть окно"
                                title="Закрыть окно"
                            />
                        </div>
                        <div className={classes.formAdmin}>
                            <FormAdmin/>
                        </div>
                    </div> : null
            }

        </div>
    );
};

export default observer(MainComponent);
