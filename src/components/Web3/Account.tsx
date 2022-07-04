import { useAccount, useEnsName } from "wagmi";
import { formatAddress } from "utils/address";
import * as React from "react";

interface Props {
    showAccountInfo: () => void;
}

export const Account = ({ showAccountInfo }: Props) => {
    const { address } = useAccount();
    if (!address) return null;
    const { data: ensName } = useEnsName({ address: address });

    const formattedAddress = formatAddress(address);

    return (
        <button
            className="nav-button hidden bg-[#23BD8F] text-white md:block hover:bg-[#1e9e78]"
            onClick={showAccountInfo}
        >
            {ensName ?? formattedAddress}
        </button>
    );
};
