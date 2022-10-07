import { Select, SelectArrow, SelectItem, SelectPopover, useSelectState } from "ariakit/select";
import { ISelectorProps } from "./types";
import { getChainNames, getLogoURI } from "interactions/contract";

export const BlockchainSelector = ({ name, label, className, enabledValues, handleChange }: ISelectorProps) => {
    const select = useSelectState({
        defaultValue: enabledValues[0],
        setValueOnMove: true,
        sameWidth: true,
        gutter: 4,
    });

    const renderValue = (chain: string) => {
        const image = getLogoURI(chain);
        return (
            <>
                <img src={image.src} alt="" aria-hidden className="h-6 w-6 rounded-full" />
                <div className="name">{chain}</div>
            </>
        );
    };

    return (
        <div className={className}>
            <label>
                <div className="input-label">{label}</div>
            </label>
            <div className="flex flex-col w-full ">
                <Select
                    state={select}
                    name={name}
                    className={
                        "input-field btn-state w-full flex cursor-pointer items-center whitespace-nowrap text-base justify-start gap-3"
                    }
                >
                    {renderValue(select.value)}
                    <SelectArrow />
                </Select>
                <SelectPopover
                    state={select}
                    className="shadow z-10 max-h-[280px] w-fit min-w-full overflow-y-auto rounded-xl border border-[#EAEAEA] bg-white p-2"
                >
                    {getChainNames()
                        .filter((chain) => chain != select.value)
                        .map((chain) =>
                            enabledValues.includes(chain) ? (
                                <SelectItem
                                    key={chain}
                                    value={chain}
                                    className="btn-state h-12 border-none rounded-md cursor-pointer flex scroll-m-2 items-center gap-2 p-2"
                                    setValueOnClick={handleChange}
                                    disabled={false}
                                >
                                    {renderValue(chain)}
                                </SelectItem>
                            ) : (
                                <SelectItem
                                    key={chain}
                                    value={chain}
                                    className="btn-state h-12 border-none rounded-md cursor-pointer flex scroll-m-2 items-center gap-2 p-2"
                                    setValueOnClick={handleChange}
                                    disabled={true}
                                >
                                    {renderValue(chain)}
                                </SelectItem>
                            )
                        )}
                </SelectPopover>
            </div>
        </div>
    );
};
