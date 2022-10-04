import React from "react";

export type TabsType = {
    label: string;
    index: number;
    Component: React.FC;
}[];
