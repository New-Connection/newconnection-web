import * as React from "react";
import { ArrowUpRightIcon, MockupTextCard, WhitelistRecordCard } from "components";
import { IWhitelistRecord } from "types";
import Link from "next/link";

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
                <div className={"flex flex-col "}>
                    <div className={"flex justify-center"}>
                        <Link
                            href={{
                                pathname: `${governorUrl}/whitelist/`,
                            }}
                        >
                            <button className="flex gap-2 btn-link mt-8">
                                View all whitelist records
                                <div className="mt-[0.125rem]">
                                    <ArrowUpRightIcon />
                                </div>
                            </button>
                        </Link>
                    </div>
                </div>
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
