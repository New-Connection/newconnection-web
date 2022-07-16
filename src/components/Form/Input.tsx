import { InputAmountProps, InputTextProps } from "./types";
import Image, { StaticImageData } from "next/image";

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
    isDisabled,
    ...props
}: InputAmountProps) => {
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
                disabled={isDisabled}
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

export const InputSupplyOfNFT = ({
    name,
    label,
    labelTitle,
    isRequired,
    className,
    placeholder,
    handleChange,
    image,
    min,
    max,
    step,
    ...props
}: InputAmountProps) => {
    return (
        <div className={className}>
            <label>
                <div title={labelTitle} className="sub-label">
                    {label}
                </div>
            </label>
            <div className="relative">
                <input
                    className={"input-field"}
                    name={name}
                    required={isRequired}
                    autoComplete="off"
                    autoCorrect="off"
                    type="number"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    placeholder="1"
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
                <div className="flex absolute inset-y-0 right-0 items-center pr-2  pointer-events-none">
                    <Image src={image as StaticImageData} height="25" width="25" />
                </div>
            </div>
        </div>
    );
};
