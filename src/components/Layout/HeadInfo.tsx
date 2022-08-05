import Head from "next/head";
import FavIcon from "assets/static/Favicon.png";
const HeadInfo = () => {
    return (
        <Head>
            <link rel="icon" type="image/png" href={FavIcon.src} />
            <title>New Connection</title>
        </Head>
    );
};

export default HeadInfo;
