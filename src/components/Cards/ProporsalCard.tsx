import ProgressBar from "components/ProgressBar/ProgressBar";
import Image from "next/image";
import Polygon from "assets/chains/Polygon.png";

const ProporsalCard = () => {
    const isActive = true;
    return (
        <div className="h-64 py-10">
            <div className="flex justify-between py-6">
                <p className="font-medium text-xl">PeaksDAO budget for 2022</p>
                <div>
                    {isActive ? (
                        <div className="flex gap-14">
                            <p className="font-light">Ends May 20, 2022, 10:00AM</p>
                            <p className="text-[#116328] bg-[#F6F6F6] px-5 py-0.5 rounded-lg">
                                Active
                            </p>
                        </div>
                    ) : (
                        <p className="text-[#9A1313] bg-[#F6F6F6] px-5 py-0.5 rounded-md">Closed</p>
                    )}
                </div>
            </div>
            <div className="flex gap-20 mb-6">
                <p className="w-2/3 font-normal">
                    The goals of this proposal are to establish a budget for the $PSP holdings of
                    PeaksDAO unvested over a year. To do this, it seeks to lower the current staking
                    rewards, rebalance the risk vs LPs, and establish upper spending limits for
                    other DAO spending categories.
                </p>
                <div className="w-1/3 gap-10">
                    <ProgressBar bgColor={1} percentage={33} />
                    <ProgressBar bgColor={2} percentage={45} />
                </div>
            </div>
            <div className="flex gap-20">
                <div className="flex gap-5">
                    <p className="text-[#CCCCCC]">For</p>
                    <p className="font-medium">PeaksDAO</p>
                </div>
                <Image src={Polygon} height={12} width={20} />
            </div>
        </div>
    );
};

export default ProporsalCard;
