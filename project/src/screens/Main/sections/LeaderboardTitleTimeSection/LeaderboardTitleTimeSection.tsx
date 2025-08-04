import React from "react";
import { Badge } from "../../../../components/ui/badge";

export const LeaderboardTitleTimeSection = (): JSX.Element => {
  return (
    <section className="w-full flex flex-col py-4 mb-6">
      <div className="flex justify-between items-center">
        <h1 className="font-thin text-textcolor-text text-[40px] leading-[48px]">
          Today&apos;s leaderboard
        </h1>

        <div
          className="flex items-center justify-center py-4 px-6 rounded-[16px] bg-[#1D1D1D] bg-[url(/rectangle-1535.svg)] bg-[100%_100%] opacity-100"
          style={{ width: "418px", height: "56px" }}
        >
          <span className="font-thin text-textcolor-text text-base">
            30 May 2022
          </span>

          <div className="w-1 h-1 bg-iconscolor-icon-secondary rounded-sm mx-4" />

          <Badge className="bg-maincolor-primary text-black rounded-lg px-2.5 py-1">
            <span className="font-thin text-sm">SUBMISSIONS OPEN</span>
          </Badge>

          <div className="w-1 h-1 bg-iconscolor-icon-secondary rounded-sm mx-4" />

          <span className="font-thin text-textcolor-text text-base">11:34</span>
        </div>
      </div>
    </section>
  );
};
