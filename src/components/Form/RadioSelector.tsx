// Radio Selector. Using for detail-proposals
// https://flowbite.com/docs/forms/radio/
import { IRadioSelector } from "./types";
import classNames from "classnames";

// TODO: Add labels
export const RadioSelector = ({ name, labels, className, handleChange }: IRadioSelector) => {
    return (
        <>
            <div>
                <input
                    id="bordered-radio-1"
                    type="radio"
                    value={0}
                    name={name}
                    className="hidden peer"
                    onChange={handleChange}
                />
                <label
                    htmlFor="bordered-radio-1"
                    className={classNames(
                        className,
                        "inline-flex justify-between items-center p-5 w-full text-black bg-white rounded-lg border border-gray2 cursor-pointer peer-checked:border-purple peer-checked:text-purple hover:text-btnHover hover:border-btnHover active:text-btnActive active:border-btnActive"
                    )}
                >
                    {labels[0]}
                </label>
            </div>
            <div>
                <input
                    id="bordered-radio-2"
                    type="radio"
                    value={1}
                    name={name}
                    className="hidden peer"
                    onChange={handleChange}
                />
                <label
                    htmlFor="bordered-radio-2"
                    className={classNames(
                        className,
                        "inline-flex justify-between items-center p-5 w-full text-black bg-white rounded-lg border border-gray2 cursor-pointer peer-checked:border-purple peer-checked:text-purple hover:text-btnHover hover:border-btnHover active:text-btnActive active:border-btnActive"
                    )}
                >
                    {labels[1]}
                </label>
            </div>
        </>
    );
};
