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
        <div className="flex flex-col w-full gap-4 ">
            <div className="flex text-base-content/50 pb-4 pt-0">
                <div className="flex tc w-full">
                    <div className="w-1/3">Member</div>
                    <div className="w-1/3">NFT</div>
                    <div className="w-1/3">Role</div>
                    <div className="w-1/4">Voting Power</div>
                </div>
            </div>

            {members.map((member) => (
                <div className="flex w-full px-4 py-2 bg-base-200 rounded-2xl" key={member.memberAddress}>
                    <div className="flex w-full">
                        <div className="w-1/3">{<CopyTextButton copyText={member.memberAddress} />}</div>
                        <div className="w-1/3">{renderImage(nfts, member.memberTokens)}</div>
                        <div className="w-1/3">{member.role}</div>
                        <div className="w-1/4">{member.votingPower}</div>
                    </div>
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
