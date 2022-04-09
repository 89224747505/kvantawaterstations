import React from 'react';
import classes from "./SmallLoading.module.css";

const SmallLoading = () => {
    return (
        <div className={classes.wrapper}>
            <div className={classes.preloader}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default SmallLoading;