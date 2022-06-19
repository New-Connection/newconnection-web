// NPM Dependencies
import * as React from 'react';
import { useAccount } from 'wagmi';
import { DisclosureState, useDialogState } from 'ariakit';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import classNames from 'classnames';

// OWN Componets
// import { WalletSelector } from '../../Web3';
// import { Coins } from '../../Icons';
// import Menu from './Menu';

const Header = () => {
    //const [{ data: account }] = useAccount();
    const walletDailog = useDialogState();

    return (
        <header
          className="flex items-center justify-between gap-10 bg-[#D9F4E6] text-base dark:bg-[#333336]"
          style={{
            paddingInline: 'clamp(0.5rem, 2.5vw, 2rem)',
            paddingBlock: 'clamp(1rem, 2.5vh, 2rem)',
          }}
        >
          <Link href="/" passHref>
            <a>
              <span className="sr-only">Navigate to Home Page</span>
              {/* <Logo /> */}
              <h1>New Connection</h1>
            </a>
          </Link>
    
          <nav className="flex flex-shrink-0 items-center justify-between gap-[0.625rem] bg-[#D9F4E6] text-base dark:bg-[#333336] ">
            <Link href="/members" passHref>
              <a
                className={classNames(
                  'mr-8 hidden hover:text-[#23BD8F] hover:dark:text-[#1BDBAD] lg:inline-block'
                )}
              >
                Create NFT
              </a>
            </Link>
            <Link href="/vesting" passHref>
              <a
                className={classNames(
                  'mr-8 hidden hover:text-[#23BD8F] hover:dark:text-[#1BDBAD] lg:inline-block',
                )}
              >
                Create DAO
              </a>
            </Link>
          </nav>
          {/* <WalletSelector dialog={walletDailog} /> */}
        </header>
      );

}

export default Header;