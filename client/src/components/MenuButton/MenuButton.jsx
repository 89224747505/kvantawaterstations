import React, {useState} from 'react';
import classes from "./MenuButton.module.css";

const MenuButton = (props) => {
    const [state, setState] = useState(true);

    const hover = () => setState(false);
    const out = () => setState(true);
    const background = props.background || false;
    return (
        <div
            className={state
                        ? classes.wrapper
                        : background ? classes.hoverBack
                                     : classes.hover}
            onClick={props.onClick}
            onMouseOver={hover}
            onMouseOut={out}
        >
            <img src={state ? props.src: props.srcHover} alt={props.alt} title={props.title}/>
            <div>{props.text}</div>
        </div>
    );
};

export default MenuButton;