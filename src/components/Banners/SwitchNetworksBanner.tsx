import * as React from "react";
import { useIsMounted } from "hooks";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

const SwitchNetworkBanner = () => {
    const chainIDs: number[] = [5, 80001, 43113]; // Goerli, Mumbai, FUJI
    const isMounted = useIsMounted();
    const { isConnected } = useAccount();
    const { chain } = useNetwork();
    const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

    const isIncludeNumber = (id: number) => chainIDs.some((val) => val === id); // return true if we have this chainID in chainIDs

    if (!chain || !switchNetwork) return null;
    //{/* //notification for switch network, because it's wrong network */}
    return (
        <div>
            {isConnected && !isIncludeNumber(Number(chain?.id)) ? (
                <div className="h-10 p-2 bg-red text-center text-white">
                    Please switch network to{" "}
                    <button
                        className="hover:text-gray hover:underline"
                        onClick={() => switchNetwork(chainIDs[0])}
                    >
                        Etherium Goerli
                    </button>
                    ,{" "}
                    <button
                        className="hover:text-gray hover:underline"
                        onClick={() => switchNetwork(chainIDs[2])}
                    >
                        Avalanche Fuji
                    </button>{" "}
                    or{" "}
                    <button
                        className="hover:text-gray hover:underline"
                        onClick={() => switchNetwork(chainIDs[1])}
                    >
                        Polygon Mumbai
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default SwitchNetworkBanner;
