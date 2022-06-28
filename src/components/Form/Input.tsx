import classNames from "classnames";
import { InputElement, TextAreaElement } from "./types";

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
    optional,
    handleChange,
    placeholder,
    maxLength,
    ...props
}: InputElement) => {
    return (
        <label>
            <span className="input-label">
                <span className="mr-2">{label}</span>
                {optional && <small className="text-neutral-500">Optional</small>}
            </span>
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
    optional,
    handleChange,
    placeholder,
    maxLength,
    ...props
}: TextAreaElement) => {
    return (
        <label>
            <span className="input-label">
                <span className="mr-2">{label}</span>
                {optional && <small className="text-neutral-500">Optional</small>}
            </span>
            <textarea
                className={classNames("input-field", className)}
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
