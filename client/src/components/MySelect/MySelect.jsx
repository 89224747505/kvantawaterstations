import React from 'react';
import classes from "./MySelect.module.css";

const MySelect = (props) => {
    const {children, allBorder, widthAll, ...properites} = props;

    return (
        <select
            className={allBorder
                        ? `${classes.wrapper} ${classes.borderRight}`
                        : widthAll ? `${classes.wrapper} ${classes.widthAll}` : classes.wrapper}

            {...properites}>
            {children}
        </select>
    );
};

export default MySelect;