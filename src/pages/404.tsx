import React from "react";
import { NextPage } from "next";
import Link from "next/link";

import Layout from "components/Layout/Layout";
import { Button } from "components/Form";

const Page404: NextPage = () => {
    return (
        <div>
            <Layout className="layout-base pb-0 pt-0 h-32">
                <section className="relative w-1/2">
                    <div className="flex items-center justify-center pt-36">
                        <h1 className="text-highlighter">
                            {"404 - We couldn't find that page :("}
                        </h1>
                    </div>
                    <div className="flex items-center justify-center">
                        <Link href="/">
                            <Button className="mt-10 w-1/3 h-14 secondary-button">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </section>
            </Layout>
        </div>
    );
};

export default Page404;
