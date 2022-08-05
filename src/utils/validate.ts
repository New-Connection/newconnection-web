import { ICreate } from "types/forms";
import { arrayIsEmpty, objectIsEmpty, stringIsEmpty } from "./basic";
import toast from "react-hot-toast";

export const validateForm = (formData, ignoreFields?: string[]): boolean => {
    const fields: string[] = [];
    for (const key in formData) {
        const value = formData[key];
        if (ignoreFields && ignoreFields.includes(key)) {
            continue;
        }
        if (
            (typeof value === "string" && stringIsEmpty(value)) ||
            (typeof value === "object" && (value === null || objectIsEmpty(value))) ||
            (Array.isArray(value) && arrayIsEmpty(value)) || (value === undefined)
        ) {
            fields.push(key);
        }
    }
    if (!arrayIsEmpty(fields)) {
        toast.error(`Please fill out these fields: \n${fields.join("\n")}`);
        return false;
    }
    return true;
};
