import React from "react";
import { User } from "lucide-react";
import { Button } from "../../components/ui/button";
import { LeaderboardHeaderSection } from "./sections/LeaderboardHeaderSection";
import { LeaderboardItemSection } from "./sections/LeaderboardItemSection";
import { LeaderboardTitleTimeSection } from "./sections/LeaderboardTitleTimeSection";

export const Main = (): JSX.Element => {
  return (
    <main className="bg-[#111111] w-full min-h-screen">
      <div className="max-w-[1440px] mx-auto relative">
        <header className="flex justify-between items-center w-full px-28 py-6">
          <h1 className="font-black text-white text-5xl leading-5">APP</h1>

          <Button
            variant="outline"
            className="w-[128px] h-[48px] flex items-center justify-center rounded-[40px] bg-textcolor-link text-greyscale-900 hover:bg-textcolor-link/90 px-6 py-3 gap-[10px] opacity-100"
          >
            <User className="w-6 h-6" />
            <span className="font-thin">Logout</span>
          </Button>

        </header>

        <div className="flex flex-col w-full px-28">
          <LeaderboardTitleTimeSection />
          <LeaderboardHeaderSection />
          <LeaderboardItemSection />
        </div>
      </div>
    </main>
  );
};
