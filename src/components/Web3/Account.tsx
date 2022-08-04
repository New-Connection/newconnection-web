import { useAccount, useEnsName } from "wagmi";
import { formatAddress } from "utils/address";
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
            className="nav-button border-none shadow-none text-black hidden md:block"
            onClick={showAccountInfo}
        >
            {ensName ?? formattedAddress}
        </button>
    );
};
