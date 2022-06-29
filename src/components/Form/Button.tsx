import * as React from "react";
import classNames from "classnames";
import { ButtonProps } from "./types";

export const SubmitButton = ({
    disabled = false,
    type = "submit",
    className,
    children,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={classNames("form-submit-button", className)}
            type={type}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};
