import Layout from '../components/Layout';
import * as React from 'react';
import { NextPage } from 'next'; // it's just type 
import NFTSection from '../components/NFT';

const CreateNFT: NextPage = () => {
  return (
    <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 dark:bg-[#161818]">
        <NFTSection />
    </Layout>
  );
};

export default CreateNFT;