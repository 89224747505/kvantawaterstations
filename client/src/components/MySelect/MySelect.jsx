import React from 'react';
import classes from "./MySelect.module.css";

const MySelect = (props) => {
    const {children, ...properites} = props;

    return (
        <select className={classes.wrapper} {...properites}>
            {children}
        </select>
    );
};

export default MySelect;