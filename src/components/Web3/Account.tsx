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

  return (
    <button
      className="nav-button hidden bg-[#23BD8F] text-white dark:border-[#333336] md:block"
      onClick={showAccountInfo}
    >
    {ensName ? `${ensName} (${account.address})` : account.address}
    </button>
  );
};
