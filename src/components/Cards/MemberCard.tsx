import { CopyTextButton } from "components";
import * as React from "react";
import { INFTVoting } from "types";
import { IMemberCard } from "./cardsInterfaces";

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

export const MemberCard = ({ member, nfts }: IMemberCard) => {
    return (
        <div key={member.memberAddress} className="grid grid-cols-4 w-full px-4 py-2 bg-base-200 rounded-2xl">
            <div>{<CopyTextButton copyText={member.memberAddress} />}</div>
            <div className={"justify-self-center"}>{renderImage(nfts, member.memberTokens)}</div>
            <div className={"justify-self-center"}>{member.role}</div>
            <div className={"justify-self-end mr-10"}>{member.votingPower}</div>
        </div>
    );
};
