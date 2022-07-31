import { Select, SelectArrow, SelectItem, SelectPopover, useSelectState } from "ariakit/select";

import classNames from "classnames";
import { ISelectorProps } from "./types";

const types = ["Member", "Design", "VC"];

export const TypeSelector = ({ name, label, className, handleChange }: ISelectorProps) => {
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
                        "input-selector btn-state flex cursor-default items-center whitespace-nowrap px-4 text-base justify-between gap-3"
                    }
                >
                    <div>{select.value}</div>
                    <SelectArrow />
                </Select>
                <SelectPopover
                    state={select}
                    className="input-selector flex flex-col overflow-auto overscroll-contain pt-4 pb-4 data-focus-visible focus-visible:ring focus:outline-none text-slate-500"
                >
                    {types.map((type) => (
                        <label key={type.toUpperCase()} className="input-label-selector">
                            <SelectItem
                                key={type}
                                value={type}
                                className="input-selector btn-state border-0 flex cursor-default scroll-m-2 items-center py-3"
                                setValueOnClick={handleChange}
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
