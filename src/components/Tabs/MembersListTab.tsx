import * as React from "react";
import { IMember, INFTVoting } from "types";
import { MemberCard, MockupTextCard, ViewAllButton } from "components";

interface IMembersListTab {
    members: IMember[];
    nfts: INFTVoting[];
    governorUrl: string;
}

export const MembersListTab = ({ members, nfts, governorUrl }: IMembersListTab) => {
    const visibleMembersLength: number = 5;

    return members && members.length > 0 ? (
        <div className="grid grid-flow-row gap-4">
            <div className="grid grid-cols-4 w-full px-4 py-2 text-base-content/50">
                <div>Member</div>
                <div className={"justify-self-center"}>NFT</div>
                <div className={"justify-self-center"}>Role</div>
                <div className={"justify-self-end"}>Voting Power</div>
            </div>
            {members.map((member, index) => (
                <MemberCard key={index} member={member} nfts={nfts} />
            ))}

            {members.length > visibleMembersLength && (
                <ViewAllButton label={"View all members"} pathname={`${governorUrl}/members/`} />
            )}
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
