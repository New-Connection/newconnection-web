import { Checkbox } from "ariakit/checkbox";
import { Group, GroupLabel } from "ariakit/group";

import styles from "styles/components/Form/Checkmox.module.css";
import { CheckboxProps } from "./types";

export function CheckboxGroup({ label, description, values, handleChange }: CheckboxProps) {
    return (
        <Group>
            <GroupLabel className="input-label">{label}</GroupLabel>
            <div className="input-label text-xs text-gray-500 mb-2">{description}</div>
            <div className="flex flex-row gap-6 flex-wrap">
                {values.map((value) => (
                    <label key={value.toUpperCase()} className="input-label">
                        <Checkbox
                            as="div"
                            value={value}
                            className={styles.checkbox}
                            onChange={handleChange}
                        >
                            {value}
                        </Checkbox>
                    </label>
                ))}
            </div>
        </Group>
    );
}
