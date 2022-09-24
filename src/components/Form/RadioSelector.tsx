// Radio Selector. Using for detail-proposals
// https://flowbite.com/docs/forms/radio/
import { IRadioSelector } from "./types";
import classNames from "classnames";
import React from "react";
import { useState } from "react";

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

export const RadioSelectorMulti = (radioSelector: IRadioSelector) => {
    const [clickedValue, setClickValue] = useState(null);
    return (
        <>
            {radioSelector.values ? (
                radioSelector.values.map((value, index) => (
                    <React.Fragment key={index}>
                        <input
                            id={"bordered-radio-" + (index + 1)}
                            type="radio"
                            value={value}
                            name={radioSelector.name}
                            className="hidden peer"
                            onChange={(value) => {
                                // console.log("click", index);
                                setClickValue(index);

                                return radioSelector.handleChange(value);
                            }}
                        />
                        <label
                            htmlFor={"bordered-radio-" + (index + 1)}
                            className={classNames(
                                radioSelector.className,
                                "inline-flex gap-4 items-center p-5 w-full text-black bg-white rounded-lg border border-gray2 cursor-pointer hover:text-btnHover hover:border-btnHover active:text-btnActive active:border-btnActive",
                                clickedValue === index ? "border-purple text-purple" : ""
                            )}
                        >
                            <p>
                                {
                                    //TODO: localcache
                                    index
                                }
                            </p>
                            {radioSelector.labels[index]}
                        </label>
                    </React.Fragment>
                ))
            ) : (
                <></>
            )}
        </>
    );
};
