import { useAccount, useEnsName } from 'wagmi';
import { formatAddress } from '../../utils/address';
import * as React from 'react';

interface Props {
  showAccountInfo: () => void;
}

export const Account = ({ showAccountInfo }: Props) => {
  const { data: account } = useAccount()
  if (!account) return null;
  const { data: ensName } = useEnsName({ address: account?.address })

  const formattedAddress = formatAddress(account?.address);

  return (
    <button
      className="nav-button hidden bg-[#23BD8F] text-white md:block"
      onClick={showAccountInfo}
    >
    {ensName ?? formattedAddress}
    </button>
  );
};
