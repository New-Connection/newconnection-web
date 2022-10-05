import { Checkbox } from "ariakit/checkbox";
import { Group, GroupLabel } from "ariakit/group";
import styles from "styles/components/Form/Checkmox.module.css";
import { CheckboxProps } from "./types";
import Image, { StaticImageData } from "next/image";
import { getLogoURI } from "utils/blockchains";
import classNames from "classnames";

export function CheckboxGroup({
    label,
    description,
    values,
    enabledValues,
    images = false,
    handleChange,
}: CheckboxProps) {
    let isDisabled;

    return (
        <Group>
            <GroupLabel className="input-label">{label}</GroupLabel>
            {description && <div className="input-label text-xs text-gray-500 mb-2">{description}</div>}
            <div className="flex flex-row gap-6 flex-wrap">
                {values.map((value) => {
                    if (enabledValues) {
                        isDisabled = !enabledValues.includes(value);
                    }

                    return (
                        <label
                            key={value.toUpperCase()}
                            className={"disabled:cursor-not-allowed"}
                        >
                            <Checkbox
                                as="div"
                                value={value}
                                className={classNames(styles.checkbox)}
                                onChange={handleChange}
                                disabled={isDisabled}
                            >
                                {value}
                                {images ? (
                                    <Image
                                        src={getLogoURI(value) as StaticImageData}
                                        height="25"
                                        width="25"
                                        layout="fixed"
                                    />
                                ) : (
                                    <></>
                                )}
                            </Checkbox>
                        </label>
                    );
                })}
            </div>
        </Group>
    );
}
