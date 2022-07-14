import React from "react";

interface ProgressBarInterface {
    bgColor: 1 | 2 | 3;
    percentage: number;
}

const color = {
    1: "bg-[#6858CB]", //purple
    2: "bg-[#EFDA20]", //yellow
    3: "bg-[#20a3ef]", //sky
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

const ProgressBar = ({ bgColor, percentage }: ProgressBarInterface) => {
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
        <div className={`h-[30px] w-full bg-[#F1F1F1] rounded-lg`}>
            <div className={`h-full ${styleNumber} ${color[bgColor]} rounded-lg text-right`}>
                <span className={`p-2.5 text-white`}>{`${percentageNumber}%`}</span>
            </div>
        </div>
    );
};

export default ProgressBar;
