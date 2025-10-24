import type { FC } from "react";
import { MatchStatus, type Match } from "../../../../../types/match";
import MatchCard from "../matchCard/MatchCard";
import { useEffect, useRef, useState } from "react";
import WithLoading from "../../../../loading/WithLoading";
import { connect } from "react-redux";
import tournamentDetailActions from "../../../../../redux/features/tournamentDetails/tournamentDetailAction";
import { useWorkspace } from "../../../../../customhook/useWorkspace";
import { useNotification } from "../../../../../customhook/useNotifycation";
import { TournamentRoundStatus } from "../../../../../types/tournament";

interface MatchTableProps {
    tournamentId: string;
    roundNumber: 1 | 2 | 3;
    // isLoadingByRound: { [key: number]: boolean };
    matchesByRound: { [key: number]: Match[] };
    isUpdateMatchLoading: boolean
    getMatchesInTournament: (tournamentId: string, roundNumber: 1 | 2 | 3, workspaceId: string) => Promise<void>;
    showLoading?: (isLoading: boolean) => void
    roundStatus: TournamentRoundStatus
    showEndRound: (is:boolean)=> void
}

const MatchTable: FC<MatchTableProps> = ({ roundNumber, matchesByRound, getMatchesInTournament, tournamentId, isUpdateMatchLoading, showLoading,roundStatus,showEndRound }) => {
    const listMatches = matchesByRound[roundNumber] || [];
    const { notify } = useNotification();
    const { workspaceId } = useWorkspace();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    useEffect(() => {
        if (showLoading) showLoading(isUpdateMatchLoading)
    }, [isUpdateMatchLoading])
    useEffect(() => {
        // console.log(1);
        // console.log(listMatches);
        if (workspaceId && (!listMatches || listMatches.length == 0)) {
            // console.log(2);

            getMatchesInTournament(tournamentId, roundNumber, workspaceId).catch((err) => {
                notify(`Lỗi khi lấy dữ liệu ${err}`, 'error')
            })
        }
    }, [isUpdateMatchLoading])
    useEffect(() => {
        if (
            listMatches.length > 0 &&
            listMatches.every((match) => match.status === MatchStatus.FINISHED || match.status === MatchStatus.NOT_STARTED) &&
            roundStatus !== TournamentRoundStatus.FINISHED &&
            workspaceId
        ) {
            showEndRound(true);
        }
    }, [listMatches])
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
    listMatches.forEach(match => {
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
        const allMatchesOfTable = listMatches.filter(match => (match.note || "") === table);
        const allPlayersSet = new Set<string>();
        allMatchesOfTable.forEach(match => {
            match.team1?.players?.forEach(p => allPlayersSet.add(p.name));
            match.team2?.players?.forEach(p => allPlayersSet.add(p.name));
        });
        tablePlayerCount[table] = allPlayersSet.size;
    });

    listMatches.forEach(match => {
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
                                                <MatchCard key={match.id} match={match} roundNumber={roundNumber} />
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
const mapStateToProps = (state: any) => ({
    // isLoadingByRound: state.tournamentDetail.isLoadingByRound,
    isUpdateMatchLoading: state.tournamentDetail.isUpdateMatchLoading,
    matchesByRound: state.tournamentDetail.matchesByRound,
});

const mapDispatchToProps = (dispatch: any) => ({
    getMatchesInTournament: (tournamentId: string, roundNumber: 1 | 2 | 3, workspaceId: string) => dispatch(tournamentDetailActions.getMatchesInTournament(tournamentId, roundNumber, workspaceId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(WithLoading(MatchTable));
