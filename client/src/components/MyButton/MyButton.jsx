import React from 'react';
import classes from "./MyButton.module.css";

const MyButton = (props) => {
    const {children, ...properties} = props;
    return (
        <div className={classes.wrapper}>
            <button {...properties}>{children}</button>
        </div>
    );
};

export default MyButton;