import { useEffect, useState } from "react";
import DataTable from "../DataTable"
import Pagination from "../pagination/Pagination";
import { connect } from "react-redux";
import matchActions from "../../../redux/features/match/matchActions";
import { MatchCategory, MatchStatus, type Match } from "../../../types/match";
import { useNotification } from "../../../customhook/useNotifycation";
import { useWorkspace } from "../../../customhook/useWorkspace";
import { formatVND } from "../../../ultils/format";
import { matchTypeMap } from "../../../ultils/mapEnum";
import { NavLink } from "react-router-dom";
import PATHS from "../../../router/path";
import { GoTrophy } from "react-icons/go";

interface props {
    getMatchesByPage: (workspaceId: string, page: number) => Promise<void>;
    isLoading: boolean;
    matchesByPage: Record<number, Match[]>;
    totalElements: number;
    totalPages: number;
    page: number;
}

const MatchesHistoryTable = ({
    getMatchesByPage,
    isLoading,
    matchesByPage,
    totalElements,
    // totalPages, 
}: props) => {
    const { notify } = useNotification();
    const { workspaceId } = useWorkspace();
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        if (!matchesByPage[currentPage]) {
            if (workspaceId) getMatchesByPage(workspaceId, currentPage).catch(err => {
                notify(`Lỗi kết nối tới sever ${err}`, 'error');
            });
        }
    }, [currentPage, matchesByPage]);
    const currentData = matchesByPage[currentPage] || [];
    // console.log(currentData);
    // console.log(totalElements);

    const columns = [
        {
            header: "Match",
            accessor: (row: Match) => {
                const isTeam1Winner = row.winnerId === row.team1?.id;
                const isTeam2Winner = row.winnerId === row.team2?.id;
                const isPending = row.winnerId == null;

                const getTeamName = (team?: any) => {
                    if (team?.name) return team.name;
                    return (team?.players || [])
                        .map((player: any) => player?.name)
                        .filter(Boolean)
                        .join(" & ") || "N/A";
                };

                const getTeamColor = (isWinner: boolean) => {
                    if (isPending) return "text-yellow-500";
                    return isWinner ? "text-green-600" : "text-red-600";
                };

                const renderMiddle = () => {
                    switch (row.status) {
                        case MatchStatus.ONGOING:
                        case MatchStatus.FINISHED:
                            return `${row.scoreTeam1} - ${row.scoreTeam2}`;
                        case MatchStatus.UPCOMING:
                        case MatchStatus.NOT_STARTED:
                            return "-";
                        default:
                            return "-";
                    }
                };

                const getStatusClass = () => {
                    switch (row.status) {
                        case MatchStatus.ONGOING:
                            return "bg-green-500";
                        case MatchStatus.UPCOMING:
                            return "bg-yellow-500";
                        case MatchStatus.NOT_STARTED:
                            return "bg-red-500";
                        default:
                            return "text-gray-500";
                    }
                };

                return (
                    <div className="font-medium flex items-center gap-2">
                        {
                            row.status !== MatchStatus.FINISHED &&
                            <span className={`rounded-[1rem] p-1 pl-2 pr-2 text-white scale-75 font-bold ${getStatusClass()}`}>
                                {row.status}
                            </span>
                        }
                        <span className={getTeamColor(isTeam1Winner)}>
                            {getTeamName(row.team1)}
                        </span>{" "}
                        <span className="text-gray-800">{renderMiddle()}</span>{" "}
                        <span className={getTeamColor(isTeam2Winner)}>
                            {getTeamName(row.team2)}
                        </span>

                    </div>
                );
            },

            width: "300px",
        },
        {
            header: "Date",
            accessor: (row: Match) => {
                if (!row.matchDate) return "-"
                return row.matchDate
            },
            width: "120px",
        },
        {
            header: "Type",
            accessor: (row: Match) => {
                // Nếu là "Bàn nước" thì chỉ hiện tên đó
                if (row.matchCategory === MatchCategory.FUN) return "Bàn nước"
                if (row.matchCategory === MatchCategory.BETTING && row.betAmount) return `Kèo ${formatVND(row.betAmount)}`
                if (row.tournamentId && row.tournamentName) {
                    return <div>
                        <span className={`text-[0.9rem] text-slate-700 ${matchTypeMap[row.matchType].className}`}>{matchTypeMap[row.matchType].label}</span>
                        <br></br>
                        <div className="flex gap-1">
                            <span>Giải</span>
                            <NavLink to={`${PATHS.TOURNAMENT}/${row.tournamentId}`} className={`underline hover:text-gray-500 flex gap-1`}>
                                <span className="flex gap-1">
                                    {row.tournamentName}
                                    <GoTrophy className="text-yellow-500 " size={20} />
                                </span>
                            </NavLink>
                        </div>

                    </div>
                }

                return `${row.matchType} - ${row.matchCategory}`
            },
            width: "180px",
        },
        {
            header: "Rack Check",
            accessor: (row: Match) => {
                if (row.tournamentId && row.tournamentName) return ""
                return ""
            },
            width: "150px",
        },
    ]

    return (
        <div className="w-full border mt-4 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    <DataTable<Match>
                        key={`page-${currentPage}`}
                        columns={columns}
                        isLoading={isLoading}
                        data={currentData}
                        totalElement={totalElements} />
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalItems={totalElements}
                pageSize={10}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

const mapStateToProps = (state: any) => ({
    isLoading: state.matches.isLoading,
    matchesByPage: state.matches.matchesByPage,
    totalElements: state.matches.totalElements,
    totalPages: state.matches.totalPages,
    page: state.matches.page,
});

const mapDispatchToProps = (dispatch: any) => ({
    getMatchesByPage: (workspaceId: string, page: number) => dispatch(matchActions.getMatchesByPage(workspaceId, page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchesHistoryTable) 
