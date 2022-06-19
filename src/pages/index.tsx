import * as React from 'react';

import Layout from '../components/Layout';
// import { HistorySection } from 'components/History';
// import { StreamSection } from 'components/Stream';
// import { NO_BANNER } from 'utils/banner';

const Home = () => {
  return (
    <Layout className="dark: flex flex-col gap-[30px] dark:bg-[#161818]" noBanner={false}>
      {/* <section className="app-section dark:bg-[#161818]">
        <Balance />
      </section>
      <section className="app-section flex h-full flex-1 flex-col gap-[50px] bg-[#D9F2F4]/10 py-[22px] dark:bg-[#161818]">
        <StreamSection />
        <HistorySection />
      </section> */}
    </Layout>
  );
};

export default Home;