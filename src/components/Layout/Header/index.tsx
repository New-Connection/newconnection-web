// NPM Dependencies
import * as React from 'react';
import { useAccount } from 'wagmi';
import { DisclosureState, useDialogState } from 'ariakit';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// OWN Componets
import { WalletSelector, Account } from '../../Web3';
// import { Coins } from '../../Icons';
// import Menu from './Menu';
import Logo from '../../Logo';

const Header = () => {
    const { data: account } = useAccount();
    const walletDailog = useDialogState(); // For pop-up with wallets 
    const router = useRouter();            

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
              <Logo />
            </a>
          </Link>
    
          <nav className="flex flex-shrink-0 items-center justify-between gap-[0.625rem] bg-[#D9F4E6] text-base dark:bg-[#333336] ">
            <Link href="/create-nft" passHref>
              <a
                className={classNames(
                  'mr-8 hidden hover:text-[#23BD8F] hover:dark:text-[#1BDBAD] lg:inline-block',
                  router.pathname === '/create-nft'
                )}
              >
                Create NFT
              </a>
            </Link>
            <Link href="/create-dao" passHref>
              <a
                className={classNames(
                  'mr-8 hidden hover:text-[#23BD8F] hover:dark:text-[#1BDBAD] lg:inline-block',
                  router.pathname === '/create-dao'
                )}
              >
                Create DAO
              </a>
            </Link>
            {account ? (
          <>
            <Account showAccountInfo={walletDailog.toggle} />
          </>
        ) : (
          <button
            className="nav-button hidden dark:border-[#1BDBAD] dark:bg-[#23BD8F] dark:text-white md:block"
            onClick={walletDailog.toggle}
          >
            Connect Wallet
          </button>
        )}
          </nav>
          <WalletSelector dialog={walletDailog} />
        </header>
      );

}

export default Header;