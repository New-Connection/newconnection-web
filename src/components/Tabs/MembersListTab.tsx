import * as React from "react";
import { IMember, INFTVoting } from "types";
import { CopyTextButton, MockupTextCard } from "components";

interface IMembersListTab {
    members: Map<string, IMember>;
    nfts: INFTVoting[];
}

const renderImage = (nfts: INFTVoting[], memberTokens: Set<string>) => {
    return (
        <div className={"flex"}>
            {nfts.map((nft) => {
                return memberTokens.has(nft.tokenAddress) &&
                    <img key={nft.tokenAddress} src={nft.image} alt="" aria-hidden className="h-6 w-6 rounded-full" />;
            })}
        </div>
    );
};

export const MembersListTab = ({ members, nfts }: IMembersListTab) => {
    return members ? (
        <div className="w-full justify-between space-y-5 gap-5">
            <div className="flex text-gray2 pb-4 pt-0">
                <div className="flex tc w-full">
                    <div className="w-1/3">Member</div>
                    <div className="w-1/3">NFT</div>
                    <div className="w-1/3">Role</div>
                    {/*<div className="w-1/4">Voting Power</div>*/}
                </div>
            </div>

            {Array.from(members.values()).map((member) => {
                return (
                    <div className="flex w-full" key={member.address}>
                        <div className="flex w-full tc">
                            <div className="w-1/3">{<CopyTextButton copyText={member.address} />}</div>
                            <div className="w-1/3">{renderImage(nfts, member.tokens)}</div>
                            <div className="w-1/3">{member.role}</div>
                            {/*<div className="w-1/4">{member.votingPower}</div>*/}
                        </div>
                    </div>
                );
            })}
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
