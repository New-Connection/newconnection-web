// Radio Selector. Using for detail-proposals
// https://flowbite.com/docs/forms/radio/
import { IRadioSelector, IRadioSelectorNFT } from "./types";
import classNames from "classnames";
import React, { useState } from "react";
import { NFTCard } from "../Cards/NFTCard";

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
                    <div className="relative px-4 py-2 text-black">
                        {labels[0]}
                        <span className="absolute top-0 right-0 px-1 py-1 translate-x-1/2 -translate-y-1/2 bg-red rounded-full text-xs text-white"></span>
                    </div>
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
                    <div className="relative px-4 py-2 text-black">
                        {labels[1]}
                        <span className="absolute top-0 right-0 px-1 py-1 translate-x-1/2 -translate-y-1/2 bg-green rounded-full text-xs text-white"></span>
                    </div>
                </label>
            </div>
        </>
    );
};

export const RadioSelectorNFT = (radioSelector: IRadioSelectorNFT) => {
    const [clickedValue, setClickValue] = useState(0);
    console.log(clickedValue);
    return (
        <div className={classNames(radioSelector.className, "mt-0")}>
            {radioSelector.values &&
                radioSelector.values.map((value, index) => (
                    <React.Fragment key={index}>
                        <label htmlFor={"bordered-radio-" + (index + 1)}>
                            <NFTCard
                                nftObject={value}
                                chain={radioSelector.chainId}
                                className={
                                    clickedValue === index
                                        ? "nft-card border-2 border-purple rounded-lg"
                                        : "nft-card cursor-pointer hover:text-btnHover hover:border-btnHover active:text-btnActive active:border-btnActive"
                                }
                            />
                        </label>
                        <input
                            id={"bordered-radio-" + (index + 1)}
                            type="radio"
                            value={value.title}
                            name={radioSelector.name}
                            // name={radioSelector.name}
                            className="hidden"
                            onChange={(event) => {
                                setClickValue(index);
                                return radioSelector.handleChange(event, value);
                            }}
                        />
                    </React.Fragment>
                ))}
        </div>
    );
};
