import React from 'react';
import classes from "./MyInput.module.css";

const MyInput = (props) => {
    const {label, ...properties} = props;
    return (
        <div className={classes.wrapper}>
            <span className={classes.label}>{label}</span>
            <input {...properties}/>
        </div>
    );
};

export default MyInput;