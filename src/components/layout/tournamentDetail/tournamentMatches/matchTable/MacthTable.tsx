import type { FC } from "react";
import type { Match } from "../../../../../types/match";
import MatchCard from "../matchCard/MatchCard";
import { useRef, useState } from "react";

interface MatchTableProps {
    listMatch: Match[];
}

const MatchTable: FC<MatchTableProps> = ({ listMatch }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        document.body.style.userSelect = "none"; // ❌ chặn bôi đen khi kéo
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
        document.body.style.userSelect = "auto"; // ✅ khôi phục lại
    };
    const onMouseUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = "auto"; // ✅ khôi phục lại
    };
    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    // --- Xử lý dữ liệu ---
    const roundSet = new Set<number>();
    const tableSet = new Set<string>();
    listMatch.forEach(match => {
        roundSet.add(match.round || 1);
        tableSet.add(match.note || "");
    });
    const roundKeys = Array.from(roundSet).sort((a, b) => a - b);
    const tableKeys = Array.from(tableSet).sort();

    const tableRoundMap: Record<string, Record<number, Match[]>> = {};
    const tablePlayerCount: Record<string, number> = {};
    tableKeys.forEach(table => {
        tableRoundMap[table] = {};
        roundKeys.forEach(round => {
            tableRoundMap[table][round] = [];
        });
        const allMatchesOfTable = listMatch.filter(match => (match.note || "") === table);
        const allPlayersSet = new Set<string>();
        allMatchesOfTable.forEach(match => {
            match.team1?.players?.forEach(p => allPlayersSet.add(p.name));
            match.team2?.players?.forEach(p => allPlayersSet.add(p.name));
        });
        tablePlayerCount[table] = allPlayersSet.size;
    });
    // console.log(listMatch);
    
    listMatch.forEach(match => {
        const round = match.round || 1;
        const table = match.note || "";
        tableRoundMap[table][round].push(match);
    });

    return (
        <div className="w-full overflow-hidden">
            <div
                className="overflow-x-auto cursor-grab hide-scrollbar"
                ref={scrollRef}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            >
                <table className="min-w-[max-content] border-collapse border border-gray-300">
                    <thead>
                        <tr className="text-slate-600">
                            <th className="border border-gray-400 bg-gray-200 px-2 py-1 sticky left-0 z-10">
                                Bảng
                            </th>
                            {roundKeys.map(round => (
                                <th
                                    key={round}
                                    className="border border-gray-400 bg-gray-200 px-2 py-1 text-center whitespace-nowrap"
                                >
                                    Lượt {round}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableKeys.map(table => (
                            <tr key={table}>
                                {/* Cột cố định */}
                                <td className="border border-gray-400 bg-gray-200 font-semibold px-2 py-1 text-slate-600 sticky left-0 z-10">
                                    <p className="w-fit mx-auto">
                                        {table}({tablePlayerCount[table]})
                                    </p>
                                </td>

                                {roundKeys.map(round => (
                                    <td
                                        key={round}
                                        className="border-b border-gray-300 px-6 py-2 align-top"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            {tableRoundMap[table][round].map(match => (
                                                <MatchCard key={match.id} match={match} />
                                            ))}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MatchTable;
