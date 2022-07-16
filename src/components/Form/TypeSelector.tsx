import { Select, SelectArrow, SelectItem, SelectPopover, useSelectState } from "ariakit/select";

import classNames from "classnames";
import { SelectorProps } from "./types";

const types = ["Member", "Design", "VC"];

export const TypeSelector = ({ name, label, className, handlerChange }: SelectorProps) => {
    const select = useSelectState({
        defaultValue: "Member",
        setValueOnMove: true,
        sameWidth: true,
        gutter: 4,
    });

    return (
        <div className={className}>
            <span className="input-label">{label}</span>
            <div className="flex flex-col mt-4">
                <Select
                    state={select}
                    name={name}
                    className={
                        "input-selector text-slate-800 hover:bg-[#6858CB] hover:text-gray-50 flex cursor-default items-center whitespace-nowrap px-4 text-base justify-between gap-3"
                    }
                >
                    <div>{select.value}</div>
                    <SelectArrow />
                </Select>
                <SelectPopover
                    state={select}
                    className="input-selector bg-white flex flex-col overflow-auto overscroll-contain pt-4 pb-4 data-focus-visible focus-visible:ring focus:outline-none text-slate-500"
                >
                    {types.map((type) => (
                        <label key={type.toUpperCase()} className="input-label-selector">
                            <SelectItem
                                key={type}
                                value={type}
                                className="input-selector border-0 flex cursor-default scroll-m-2 items-center py-3 hover:bg-[#6858CB] hover:text-white"
                                setValueOnClick={handlerChange}
                            >
                                {type}
                            </SelectItem>
                        </label>
                    ))}
                </SelectPopover>
            </div>
        </div>
    );
};
