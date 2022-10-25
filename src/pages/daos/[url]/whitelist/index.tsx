import { GetServerSideProps, NextPage } from "next";
import Layout, { BackButton, MockupTextCard, WhitelistRecordCard } from "components";
import * as React from "react";
import { useState } from "react";
import { IQuery, IWhitelistRecord } from "types";
import { useEffectOnce } from "usehooks-ts";
import { getWhitelist } from "interactions/database";
import { useSigner, useSwitchNetwork } from "wagmi";
import { handleWhitelistRecord } from "interactions/contract";

export const getServerSideProps: GetServerSideProps = async (context) => ({
    props: context.params,
});

const WhitelistPage: NextPage<IQuery> = ({ url }) => {
    const { data: signerData } = useSigner();
    const { switchNetwork } = useSwitchNetwork();
    const [whitelist, setWhitelist] = useState<IWhitelistRecord[]>();

    const loadingWhitelist = async () => {
        const whitelist = await getWhitelist(url);
        if (whitelist) {
            console.log("load whitelist");
            setWhitelist(() => whitelist);
        }
    };

    const addToWhitelist = async (record: IWhitelistRecord, isRejected: boolean = false) => {
        await handleWhitelistRecord(record, isRejected, signerData, switchNetwork, loadingWhitelist);
    };

    useEffectOnce(() => {
        loadingWhitelist().then();
    });

    return whitelist && whitelist.length > 0 ? (
        <div>
            <Layout className="layout-base">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <BackButton />
                    <div className="text-highlighter items-center flex flex-col md:flex-row">
                        Whitelist for
                        <div className={"text-highlighter text-primary capitalize md:ml-4"}>{`${url}`}</div>
                    </div>
                    <div className="grid grid-flow-row gap-4">
                        <div className="grid grid-cols-7 px-4 py-2 text-base-content/50">
                            <div>Wallet Address</div>
                            <div className={"justify-self-center"}>Blockchain</div>
                            <div className={"justify-self-center"}>NFT</div>
                            <p className={"col-span-2 justify-self-center"}>Notes</p>
                            <p className={"col-span-2 justify-self-end mr-20"}>Action</p>
                        </div>

                        {whitelist.map((wl, index) => (
                            <WhitelistRecordCard
                                key={index}
                                record={wl}
                                isLoaded={true}
                                handleWhitelistRecord={addToWhitelist}
                            />
                        ))}
                    </div>
                </section>
            </Layout>
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

export default WhitelistPage;
