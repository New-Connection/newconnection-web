import { Checkbox } from "ariakit/checkbox";
import { Group, GroupLabel } from "ariakit/group";
import { CheckboxProps } from "./types";
import Image, { StaticImageData } from "next/image";
import { getLogoURI } from "interactions/contract";

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
            <GroupLabel className="label input-label">{label}</GroupLabel>
            {description && <div className="input-label text-xs text-base-content/50 mb-2">{description}</div>}
            <div className="flex flex-row gap-6 flex-wrap">
                {values.map((value) => {
                    if (enabledValues) {
                        isDisabled = !enabledValues.includes(value);
                    }

                    return (
                        <label key={value.toUpperCase()}>
                            <Checkbox
                                as="div"
                                value={value}
                                className={"checkbox-field"}
                                onChange={handleChange}
                                disabled={isDisabled}
                            >
                                {value}
                                {images && (
                                    <Image
                                        src={getLogoURI(value) as StaticImageData}
                                        height="25"
                                        width="25"
                                        layout="fixed"
                                    />
                                )}
                            </Checkbox>
                        </label>
                    );
                })}
            </div>
        </Group>
    );
}
