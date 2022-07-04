import { BaseSyntheticEvent, ChangeEvent, Dispatch, SetStateAction } from "react";
import { ICreate } from "types/forms";

export const handleTextChange = <
    T extends ICreate,
    E extends HTMLInputElement | HTMLTextAreaElement
>(
    event: ChangeEvent<E>,
    set: Dispatch<SetStateAction<T>>
) => {
    set((prev) => ({ ...prev, [event.target.name]: event.target.value }));
};

export const handleImageChange = <T extends ICreate>(
    file: File | File[],
    set: Dispatch<SetStateAction<T>>,
    field: string
) => {
    set((prev) => ({ ...prev, [field]: file }));
};

export const handleCheckboxChange = <T extends ICreate>(
    event: BaseSyntheticEvent,
    formData: T,
    set: Dispatch<SetStateAction<T>>,
    field: string
) => {
    let checkboxGroup = formData[field] as string[];
    const elem = event.currentTarget;
    const label = elem.parentNode.textContent;

    if (elem.checked && !checkboxGroup.includes(label)) {
        checkboxGroup.push(label);
    }
    if (!elem.checked && checkboxGroup.includes(label)) {
        checkboxGroup = checkboxGroup.filter((value) => value !== label);
    }

    set((prev) => ({ ...prev, [field]: checkboxGroup }));
};

export const handleSelectorChange = <T extends ICreate>(
    event: BaseSyntheticEvent,
    set: Dispatch<SetStateAction<T>>,
    field: string
) => {
    const elem = event.currentTarget;
    const label = elem.parentNode.textContent;
    set((prev) => ({ ...prev, [field]: label }));
    return true;
};
