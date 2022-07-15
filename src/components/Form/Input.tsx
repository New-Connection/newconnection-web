import { InputAmountProps, InputTextProps } from "./types";

export const InputAmount = ({
    name,
    label,
    labelTitle,
    isRequired,
    className,
    handleChange,
    min,
    max,
    step,
    ...props
}: InputAmountProps) => {
    return (
        <div className={className}>
            <label title={labelTitle}>
                <span className="input-label">{label}</span>
            </label>
            <input
                className={"input-field"}
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
                min={min || 1}
                max={max || 100} //Max number of NFT
                step={step || 1}
                onChange={handleChange}
                {...props}
            />
        </div>
    );
};

export const InputText = ({
    name,
    label,
    labelTitle,
    isRequired,
    className,
    handleChange,
    placeholder,
    maxLength,
    ...props
}: InputTextProps) => {
    return (
        <div className={className}>
            <label>
                <div title={labelTitle} className="input-label">
                    {label}
                </div>
            </label>
            <input
                className={"input-field"}
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
        </div>
    );
};

export const InputTextArea = ({
    name,
    label,
    labelTitle,
    isRequired,
    className,
    handleChange,
    placeholder,
    maxLength,
    ...props
}: InputTextProps) => {
    return (
        <div className={className}>
            <label>
                <div title={labelTitle} className="input-label mr-2">
                    {label}
                </div>
            </label>
            <textarea
                className={"input-field resize-none h-28"}
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
        </div>
    );
};
