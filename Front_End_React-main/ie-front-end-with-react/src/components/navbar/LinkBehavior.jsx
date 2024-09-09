import React from "react";
import { Link as RouterLink } from "react-router-dom";

// Utilizamos forwardRef para pasar una referencia al componente LinkBehavior
const LinkBehavior = React.forwardRef((props, ref) => {
    // Desestructuramos los props para excluir 'button' y cualquier otro prop
    const { button, ...restProps } = props;

    // Pasamos los props restantes a RouterLink
    return <RouterLink ref={ref} {...restProps} />;
});

export default LinkBehavior;
