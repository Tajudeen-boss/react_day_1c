import { ChevronDown } from "lucide-react";

export const LeaderboardHeaderSection = (): JSX.Element => {
  const headerColumns = [
    { id: "rank", label: "#", hasIcon: false },
    { id: "title", label: "Title", hasIcon: false },
    { id: "author", label: "Author", hasIcon: false },
    { id: "mostLiked", label: "Most Liked", hasIcon: true },
  ];

  return (
    <header
      className="w-full h-[35px] rounded-lg overflow-hidden grid items-center text-[#666666]"
      style={{
        gridTemplateColumns: "50px 1fr 1fr 150px",
      }}
    >
      {headerColumns.map((column) => (
        <div key={column.id} className="flex items-center px-4">
          <span className="font-['Inter',Helvetica] font-thin text-base whitespace-nowrap">
            {column.label}
          </span>
          {column.hasIcon && <ChevronDown className="w-4 h-4 ml-2" />}
        </div>
      ))}
    </header>
  );
};
