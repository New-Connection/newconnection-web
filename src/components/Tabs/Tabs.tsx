import React, { FC } from "react";

type TabsProps = {
    tabs: {
        label: string;
        index: number;
        Component: FC<{ index: number }>;
    }[];
    selectedTab: number;
    onClick: (index: number) => void;
    className?: string;
};

/**
 * Avalible Props
 * @param tab Array of object
 * @param selectedTab number
 * @param onClick Function to set the active tab
 */
const Tabs: FC<TabsProps> = ({ tabs = [], selectedTab = 0, onClick }) => {
    const Panel = tabs && tabs.find((tab) => tab.index === selectedTab);
    return (
        <div>
            <div role="flex flex-wrap border-b-4 relative">
                {tabs.map((tab) => (
                    <button
                        className={
                            selectedTab === tab.index
                                ? "border-b-2 border-solid w-36 border-[#6858CB] px-2 py-4 my-4 text-[#6858CB]"
                                : "border-b-2 border-solid w-36 border-transparent px-2 py-4 my-4 focus:border-[#6858CB] focus:text-[#6858CB] hover:border-[#6858CB] hover:text-[#6858CB]"
                        }
                        onClick={() => onClick(tab.index)}
                        key={tab.index}
                        type="button"
                        aria-selected={selectedTab === tab.index}
                        aria-controls={`tabpanel-${tab.index}`}
                        tabIndex={selectedTab === tab.index ? 0 : -1}
                        id={`btn-${tab.index}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div id={`tabpanel-${selectedTab}`} className="text-left py-4">
                {Panel && <Panel.Component index={selectedTab} />}
            </div>
        </div>
    );
};
export default Tabs;
