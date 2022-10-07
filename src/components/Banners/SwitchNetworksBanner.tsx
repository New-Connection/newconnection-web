import * as React from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { getChainIds } from "interactions/contract";

const SwitchNetworkBanner = () => {
    const chainIDs: number[] = getChainIds(); // Goerli, Mumbai, FUJI
    const { isConnected } = useAccount();
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();

    const isIncludeNumber = (id: number) => chainIDs.some((val) => val === id); // return true if we have this chainID in chainIDs

    if (!chain || !switchNetwork) return null;
    return (
        <div>
            {isConnected && !isIncludeNumber(Number(chain?.id)) ? (
                <div className="h-10 p-2 bg-red text-center text-white">
                    Please switch network to{" "}
                    <button className="hover:text-gray hover:underline" onClick={() => switchNetwork(chainIDs[0])}>
                        Ethereum Rinkeby
                    </button>
                    ,{" "}
                    <button className="hover:text-gray hover:underline" onClick={() => switchNetwork(chainIDs[2])}>
                        Avalanche Fuji
                    </button>{" "}
                    or{" "}
                    <button className="hover:text-gray hover:underline" onClick={() => switchNetwork(chainIDs[1])}>
                        Polygon Mumbai
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default SwitchNetworkBanner;
