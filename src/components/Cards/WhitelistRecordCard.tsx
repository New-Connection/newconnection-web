import { CopyTextButton } from "components";
import * as React from "react";
import { useState } from "react";
import { getLogoURI } from "interactions/contract";
import { IWhitelistRecordCard } from "./cardsInterfaces";

const renderValue = (chain: string) => {
    const image = getLogoURI(chain);
    return <img src={image.src} alt="" aria-hidden className="h-6 w-6 rounded-full" />;
};

export const WhitelistRecordCard = ({ record, isLoaded, handleWhitelistRecord }: IWhitelistRecordCard) => {
    const [click, setClick] = useState(false);
    const walletAddress = record.walletAddress;
    const votingTokenName = record.votingTokenName;
    const note = record.note;
    const blockchainSelected = record.blockchainSelected;

    return (
        <div className="grid grid-cols-7 items-center px-4 py-2 bg-base-200 rounded-2xl">
            <div>{<CopyTextButton copyText={walletAddress} />}</div>
            <div className={"justify-self-center"}>{renderValue(blockchainSelected[0])}</div>
            <div className={"justify-self-center"}>{votingTokenName}</div>
            <p className="col-span-2 text-sm line-clamp-3 text-center justify-self-center">{note}</p>

            {isLoaded && (
                <div className={"col-span-2 btn-group justify-self-end"}>
                    <button
                        className="btn btn-sm bg-success border-base-200"
                        onClick={async () => {
                            setClick(true);
                            await handleWhitelistRecord(record, false);
                            setClick(false);
                        }}
                        disabled={click}
                    >
                        {click ? "Loading..." : "Add"}
                    </button>
                    <button
                        className="btn btn-sm bg-error border-base-200"
                        onClick={async () => {
                            await handleWhitelistRecord(record, true);
                        }}
                        disabled={click}
                    >
                        {"Delete"}
                    </button>
                </div>
            )}
        </div>
    );
};
