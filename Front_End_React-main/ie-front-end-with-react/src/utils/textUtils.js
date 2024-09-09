import React from "react";
import { Link as RoterLink } from "react-router-dom";

const LinkBehavior = React.forwardRef((props, ref) => {
    //Destructurar los proprs para exclui 'button' y cualquier otro prop
    const {button, ...restProps} = props;

    //Solo pasa los props que deberia ir a RouterLink
    return <RoterLink ref={ref} {...restProps} />;


})

export default LinkBehavior;