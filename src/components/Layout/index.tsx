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

export default function Layout({ children, className, noBanner = false, ...props }: ILayoutProps) {
  const router = useRouter();
  const onboardDialog = useDialogState();

  return (
    <>
      <Header/>
      {/* {router.pathname === '/'} */}
      <CustomToast />
    </>
  );
}
