import Head from 'next/head';
import * as React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useDialogState } from 'ariakit';
import toast from 'react-hot-toast';
// import '../../index.css';

// import OnboardDialog from 'components/Onboard';
import Header from './Header';
import CustomToast from '../CustomToast';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
  noBanner?: boolean;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
  const router = useRouter();
  const onboardDialog = useDialogState();

  return (
    <>
      <Head>
        <title>New Connection</title>
        <meta
          name="description"
          content="New Connection is a multi-chain DAO protocol that allows you to create oranisation based on NFT-membership."
        />
      </Head>    
      <Header/>
      {router.pathname === '/'}
      <main className={classNames('flex-1', className)} {...props}>
        {children}
      </main>
      <CustomToast />
    </>
  );
}
