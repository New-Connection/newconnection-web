import ProgressBar from "components/ProgressBar/ProgressBar";
import Image from "next/image";
import Polygon from "assets/chains/Polygon.png";
import { timestampToDate } from "utils/basic";

interface IProporsalCard {
    title: string;
    shortDescription: string;
    description?: string;
    daoName?: string;
    blockchain?: string[];
    isActive?: boolean;
    forVotes?: string;
    againstVotes?: string;
    deadline?: number;
}

const ProporsalCard = ({
    title,
    shortDescription,
    daoName,
    isActive,
    forVotes,
    againstVotes,
    deadline,
}: IProporsalCard) => {
    const againstV = +againstVotes! ?? 0;
    const forV = +forVotes! ?? 0;
    const sumV = againstV + forV || 1;

    return (
        <div className="h-52 py-5">
            <div className="flex justify-between pb-6">
                <p className="font-medium text-xl">{title}</p>
                <div>
                    {isActive ? (
                        <div className="flex gap-5">
                            <p className="font-light text-sm mt-1">
                                Ends {timestampToDate(deadline || 0)}
                            </p>
                            <p className="text-green bg-gray px-5 py-0.5 rounded-full">Active</p>
                        </div>
                    ) : (
                        <p className="text-red bg-gray px-5 py-0.5 rounded-full">Closed</p>
                    )}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="w-3/4 grid grid-cols-1 content-between">
                    <p className="w-full font-normal line-clamp-3 pr-4">{shortDescription}</p>
                    <div className="flex gap-5 pb-2">
                        <div className="flex gap-5">
                            <p className="text-gray3">For</p>
                            <p className="font-medium">{daoName}</p>
                        </div>
                        <Image src={Polygon} height={12} width={23} />
                    </div>
                </div>

                <div className="w-1/4">
                    <ProgressBar bgColor={1} percentage={againstV / sumV} title="Against" />
                    <ProgressBar bgColor={3} percentage={forV / sumV} title="In favor" />
                </div>
            </div>
        </div>
    );
};

export default ProporsalCard;
