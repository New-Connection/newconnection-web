import { useAccount } from "wagmi";
import { formatAddress } from "utils";
import * as React from "react";

interface Props {
    showAccountInfo: () => void;
}

export const Account = ({ showAccountInfo }: Props) => {
    const { address } = useAccount();
    if (!address) return null;
    const ensName = null;
    // const { data: ensName } = useEnsName({ address: address });

    const formattedAddress = formatAddress(address);

    return (
        <button
            className="nav-button bg-gray border-none shadow-none text-black font-normal text-sm hidden md:block"
            onClick={showAccountInfo}
        >
            {ensName ?? formattedAddress}
        </button>
    );
};
