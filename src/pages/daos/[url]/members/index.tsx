import { GetServerSideProps, NextPage } from "next";
import Layout, { BackButton, MemberCard, MockupTextCard } from "components";
import * as React from "react";
import { useState } from "react";
import { IMember, INFTVoting, IQuery } from "types";
import { useEffectOnce, useReadLocalStorage } from "usehooks-ts";
import { getAllMembersForDao } from "interactions/database";

export const getServerSideProps: GetServerSideProps = async (context) => ({
    props: context.params,
});

const WhitelistPage: NextPage<IQuery> = ({ url }) => {
    const [members, setMembers] = useState<IMember[]>();
    const [NFTs, setNFTs] = useState<INFTVoting[]>();

    const storageNFTs = useReadLocalStorage<INFTVoting[]>(`${url} NFTs`);

    useEffectOnce(() => {
        setNFTs(storageNFTs);

        const loadingMembers = async () => {
            const newMembers = await getAllMembersForDao(url);
            if (newMembers) {
                setMembers(() => newMembers);
            }
        };

        loadingMembers().then();
    });

    return members && members.length > 0 ? (
        <div>
            <Layout className="layout-base">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <BackButton />
                    <div className="text-highlighter items-center flex flex-col md:flex-row">
                        Members of
                        <div className={"text-highlighter text-primary capitalize md:ml-4"}>{`${url}`}</div>
                    </div>

                    <div className="grid grid-flow-row gap-4">
                        <div className="grid grid-cols-4 w-full px-4 py-2 text-base-content/50">
                            <div>Member</div>
                            <div className={"justify-self-center"}>NFT</div>
                            <div className={"justify-self-center"}>Role</div>
                            <div className={"justify-self-end"}>Voting Power</div>
                        </div>

                        {members.map((member) => (
                            <MemberCard member={member} nfts={NFTs} />
                        ))}
                    </div>
                </section>
            </Layout>
        </div>
    ) : (
        <div className="text-center">
            <MockupTextCard
                label={"No members here yet"}
                text={"You can send a request to join the DAO by clicking the become a member button"}
            />
        </div>
    );
};

export default WhitelistPage;
