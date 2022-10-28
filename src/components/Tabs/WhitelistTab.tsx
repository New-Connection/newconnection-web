import * as React from "react";
import { MockupTextCard, ViewAllButton, WhitelistRecordCard } from "components";
import { IWhitelistRecord } from "types";

interface IWhitelistTab {
    whitelist: IWhitelistRecord[];
    isLoaded: boolean;
    governorUrl: string;
    handleWhitelistRecord: (record: IWhitelistRecord, isRejected: boolean) => Promise<void>;
}

export const WhitelistTab = ({ whitelist, isLoaded, governorUrl, handleWhitelistRecord }: IWhitelistTab) => {
    const visibleWhitelistLength: number = 5;

    return whitelist && whitelist.length !== 0 ? (
        <div className="grid grid-flow-row gap-4">
            <div className="grid grid-cols-7 px-4 py-2 text-base-content/50">
                <div>Wallet Address</div>
                <div className={"justify-self-center"}>Blockchain</div>
                <div className={"justify-self-center"}>NFT</div>
                <p className={"col-span-2 justify-self-center"}>Notes</p>
                <p className={"col-span-2 justify-self-end mr-20"}>Action</p>
            </div>
            {whitelist.slice(0, visibleWhitelistLength).map((wl, index) => (
                <WhitelistRecordCard
                    key={index}
                    record={wl}
                    isLoaded={isLoaded}
                    handleWhitelistRecord={handleWhitelistRecord}
                />
            ))}
            {whitelist.length > visibleWhitelistLength && (
                <ViewAllButton label={"View all whitelist records"} pathname={`${governorUrl}/whitelist/`} />
            )}
        </div>
    ) : (
        <div className="text-center">
            <MockupTextCard
                label={"No whitelist requests here yet"}
                text={
                    "You can send a request to join the DAO by clicking the become a member button" +
                    "then click the button “Add new proposals” and initiate a proposals"
                }
            />
        </div>
    );
};
