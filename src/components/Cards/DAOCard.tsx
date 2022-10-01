import * as React from "react";
import Image from "next/image";
import ASSETS from "assets/index";
import Link from "next/link";
import { isIpfsAddress } from "utils/ipfsUpload";

export const DAOCard = ({ name, description, profileImage, url, isActive, proposals }) => {
    return (
        <Link href={`/daos/${url}`}>
            <div
                className={
                    "flex justify-between w-full lg:h-40 h-50 p-3 border-b-2 border-gray cursor-pointer active:bg-gray"
                }
            >
                <div className="flex gap-10 w-10/12">
                    <div className="w-28 h-28">
                        <Image
                            width={"150"}
                            height={"150"}
                            layout={"responsive"}
                            priority={true}
                            src={!isIpfsAddress(profileImage) ? profileImage : ASSETS.daoLogoMock}
                            className="rounded-2xl"
                        />
                    </div>
                    <div className="w-5/6 grid grid-cols-1 content-between">
                        <div className="w-full">
                            <p className="lg:text-lg text-base uppercase font-semibold cursor-pointer">
                                {name}
                            </p>
                            <div className="text-gray-500 line-clamp-2">{description}</div>
                        </div>

                        <p
                            className={
                                "text-gray2 text-sm cursor-pointer mb-1.5 hover:text-gray3 active:text-gray2"
                            }
                        >
                            View more
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:w-32 w-24 text-center text-xs">
                    {isActive ? (
                        <span className="badge-active">Active voting now</span>
                    ) : (
                        <span className="badge-active text-black">No active voting</span>
                    )}
                    <div className={"flex flex-col gap-3 mt-4"}>
                        <div className={"flex justify-between"}>
                            <p className={"text-gray2"}>Proposals:</p>
                            <p>{proposals || 0}</p>
                        </div>
                        {/* <div className={"flex justify-between"}>
                            <p className={"text-gray2"}>Votes:</p>
                            <p className="text-black">{votes || 0}</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </Link>
    );
};
