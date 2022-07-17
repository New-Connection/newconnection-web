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
            className="nav-button hidden md:block hover:bg-[#6858CB] hover:text-white"
            onClick={showAccountInfo}
        >
            {ensName ?? formattedAddress}
        </button>
    );
};
