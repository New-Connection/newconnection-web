import Image from "next/image";
import { getLogoURI } from "interactions/contract";
import ASSETS from "assets";
import * as React from "react";

export const BlockchainIcon = ({ chain }: { chain: number | string }) => {
    return (
        <Image
            src={chain ? getLogoURI(chain) : ASSETS.defaultToken}
            height={22}
            width={22}
            layout={"fixed"}
            className={""}
        />
    );
};
