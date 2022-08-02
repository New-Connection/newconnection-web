import React from "react";
// TODO: Change to this
// https://flowbite.com/docs/components/progress/
interface ProgressBarInterface {
    bgColor: 1 | 2 | 3;
    percentage: number;
    title?: string;
    votes?: number;
}

const color = {
    1: "bg-[#7343DF]", //purple
    2: "bg-[#F8E155]", //yellow
    3: "bg-[#EF5390]", //red
};

// better to use [1/2, 1/3, 1/4, 1/5, 1/6] - no more than six
const numbersWeight = {
    0: "",
    16: "w-1/6",
    20: "w-1/5",
    25: "w-1/4",
    33: "w-1/3",
    40: "w-2/5",
    50: "w-1/2",
    60: "w-3/5",
    66: "w-2/3",
    75: "w-3/4",
    80: "w-4/5",
    83: "w-5/6",
    100: "w-full",
};

const ProgressBar = ({ bgColor, percentage, title }: ProgressBarInterface) => {
    function getClosestNumber(dict, value: number) {
        var key, found, found_value;
        for (key in dict) {
            if (value - key > 0) {
                found = key;
                found_value = value;
            }
        }
        return [dict[found], found_value];
    }

    const [styleNumber, percentageNumber] = getClosestNumber(numbersWeight, percentage);

    return (
        <div>
            <div className="flex py-2.5 justify-between text-sm">
                <span>{title}</span>
                <span className="">{`${percentageNumber}%`}</span>
            </div>

            <div className={`h-[6px] w-full bg-[#F1F1F1] rounded-lg mb-4`}>
                <div
                    className={`h-full ${styleNumber} ${color[bgColor]} rounded-lg text-right`}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
