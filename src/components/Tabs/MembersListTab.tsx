import * as React from "react";
import { IMember, INFTVoting } from "types";
import { CopyTextButton, MockupTextCard } from "components";

interface IMembersListTab {
    members: IMember[];
    nfts: INFTVoting[];
}

const renderImage = (nfts: INFTVoting[], memberTokens: string[]) => {
    return (
        <div className={"flex"}>
            {nfts &&
                nfts.map((nft) => {
                    return (
                        memberTokens.includes(nft.tokenAddress) && (
                            <img
                                key={nft.tokenAddress}
                                src={nft.image}
                                alt=""
                                aria-hidden
                                className="h-6 w-6 rounded-full"
                            />
                        )
                    );
                })}
        </div>
    );
};

export const MembersListTab = ({ members, nfts }: IMembersListTab) => {
    return members.length > 0 ? (
        <div className="grid grid-flow-row gap-4">
            <div className="grid grid-cols-4 w-full px-4 py-2 text-base-content/50">
                <div>Member</div>
                <div className={"justify-self-center"}>NFT</div>
                <div className={"justify-self-center"}>Role</div>
                <div className={"justify-self-end"}>Voting Power</div>
            </div>

            {members.map((member) => (
                <div key={member.memberAddress} className="grid grid-cols-4 w-full px-4 py-2 bg-base-300 rounded-2xl">
                    <div>{<CopyTextButton copyText={member.memberAddress} />}</div>
                    <div className={"justify-self-center"}>{renderImage(nfts, member.memberTokens)}</div>
                    <div className={"justify-self-center"}>{member.role}</div>
                    <div className={"justify-self-end mr-10"}>{member.votingPower}</div>
                </div>
            ))}
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
