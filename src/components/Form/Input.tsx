import classNames from "classnames";
import { InputElement } from "./types";

export const InputAmount = ({
    name,
    label,
    isRequired,
    className,
    handleChange,
    ...props
}: InputElement) => {
    return (
        <label>
            <span className="input-label">{label}</span>
            <input
                className={classNames("input-field", className)}
                name={name}
                required={isRequired}
                autoComplete="off"
                autoCorrect="off"
                type="number"
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder="1 (Max. 100)"
                minLength={1}
                maxLength={79}
                spellCheck="false"
                inputMode="decimal"
                title="Enter numbers only."
                min={1}
                max={100} //Max number of NFT
                step={1}
                onChange={handleChange}
                {...props}
            />
        </label>
    );
};

export const InputText = ({
    name,
    label,
    isRequired,
    className,
    handleChange,
    placeholder,
    maxLength,
    ...props
}: InputElement) => {
    return (
        <label>
            <div className="input-label mr-2">{label}</div>
            <input
                className={classNames("input-field", className)}
                name={name}
                required={isRequired}
                autoComplete="off"
                autoCorrect="off"
                type="text"
                spellCheck="false"
                placeholder={placeholder}
                onChange={handleChange}
                maxLength={maxLength}
                {...props}
            />
        </label>
    );
};

export const InputTextArea = ({
    name,
    label,
    isRequired,
    className,
    handleChange,
    placeholder,
    maxLength,
    ...props
}: InputElement) => {
    return (
        <label>
            <div className="input-label mr-2">{label}</div>
            <textarea
                className={classNames("input-field resize-none h-28", className)}
                name={name}
                required={isRequired}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                placeholder={placeholder}
                onChange={handleChange}
                maxLength={maxLength}
                {...props}
            />
        </label>
    );
};
