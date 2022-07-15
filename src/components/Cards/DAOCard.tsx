import * as React from "react";
import BasicAvatar from "assets/basic_avatar.jpg";
import Image from "next/image";

const DAOCard = (props) => {
    return (
        <div className="flex my-4 gap-16">
            <Image src={BasicAvatar} width="125" height="125" layout="fixed" />
            <div className="w-3/5 justify-between">
                <p className="text-lg font-bold">DAO Name</p>
                {/* About style for paragraph https://codepen.io/ShanShahOfficial/pen/wvBYwaB */}
                <p className="overflow-hidden leading-5 max-h-20 block text-ellipsis">
                    A DAO, or “Decentralized Autonomous Organization,” is a community-led entity
                    with no central authority. It is fully autonomous and transparent: smart
                    contracts lay the foundational rules, execute the agreed upon decisions, and at
                    any point, proposals, voting, and even the very code itself can be publicly
                    audited.
                </p>
                <button className="text-gray-500">View more</button>
            </div>
            <div>
                <p>Active voting now</p>
                <p className="text-gray-500 text-sm">Proporsals {props.proporsal}</p>
                <p className="text-gray-500 text-sm">Voting {props.voting}</p>
            </div>
        </div>
    );
};

export default DAOCard;
