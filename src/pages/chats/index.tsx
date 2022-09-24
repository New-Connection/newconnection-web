import * as React from "react";
import type { NextPage } from "next";
import Layout from "components/Layout/Layout";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNetwork } from "wagmi";

const ChatsPage: NextPage = () => {
    const chats = ["Chat 01", "Chat 02", "Chat 03"];
    const [isChatActiveIndex, chatActive] = useState(null);
    return (
        <div>
            <Layout className="layout-base max-w-full">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-highlighter">Chats</h1>
                        </div>
                        <>
                            <div className="container mx-auto rounded-lg border-t-2 border-gray">
                                <div className="flex flex-row justify-between bg-white">
                                    {/* User chat*/}
                                    <div className="flex flex-col w-2/5 overflow-y-auto border-r-2 border-gray pb-4">
                                        <ul>
                                            {chats.map((chatName, index) => (
                                                <li
                                                    className="flex flex-row py-4 px-2 justify-center items-center"
                                                    onClick={() => {
                                                        isChatActiveIndex(index);
                                                    }}
                                                >
                                                    <div className="w-full">
                                                        <div className="text-lg font-semibold">
                                                            {chatName}
                                                        </div>

                                                        <span className="text-gray-500">
                                                            Pick me at 9:00 Am
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Messanger IFRAME */}
                                    <div className="w-full px-5 flex flex-col justify-between">
                                        <div className="flex flex-col mt-5"></div>

                                        <iframe
                                            src="https://newconnection.click/555/Max"
                                            width="100"
                                            height="100"
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                                    {/* RIGHT STACK - DETAIL INFO*/}
                                    <div className="w-2/5 border-l-2 border-gray px-5">
                                        <div className="flex flex-col">
                                            <div className="font-semibold text-xl py-4">
                                                Mern Stack Group
                                            </div>
                                            <img
                                                src="https://source.unsplash.com/L2cxSuKWbpo/600x600"
                                                className="object-cover rounded-xl h-64"
                                                alt=""
                                            />
                                            <div className="font-semibold py-4">
                                                Created 22 Sep 2021
                                            </div>
                                            <div className="font-light">
                                                Lorem ipsum dolor sit amet consectetur adipisicing
                                                elit. Deserunt, perspiciatis!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default ChatsPage;
