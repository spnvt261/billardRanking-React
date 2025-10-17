import { useEffect, useState } from "react";
import DataTable from "../DataTable"
import Pagination from "../pagination/Pagination";
import { connect } from "react-redux";
import matchActions from "../../../redux/features/match/matchActions";
import { MatchCategory, type Match } from "../../../types/match";
import { useNotification } from "../../../customhook/useNotifycation";
import { useWorkspace } from "../../../customhook/useWorkspace";
import { formatVND } from "../../../ultils/format";

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

    const columns = [
        {
            header: "Match",
            accessor: (row: Match) => {
                const isTeam1Winner = row.winnerId === row.team1?.id
                const isTeam2Winner = row.winnerId === row.team2?.id

                return (
                    <div className="font-medium">
                        <span className={isTeam1Winner ? "text-green-600" : "text-red-600"}>
                            {row.team1?.name
                                ? row.team1.name
                                : (row.team1?.players || [])
                                    .map((player) => player?.name)
                                    .filter(Boolean)
                                    .join(" & ") || "N/A"}
                        </span>{" "}
                        <span className="text-gray-800">
                            {row.scoreTeam1} - {row.scoreTeam2}
                        </span>{" "}
                        <span className={isTeam2Winner ? "text-green-600" : "text-red-600"}>
                            {row.team2?.name
                                ? row.team2.name
                                : (row.team2?.players || [])
                                    .map((player) => player?.name)
                                    .filter(Boolean)
                                    .join(" & ") || "N/A"}
                        </span>
                    </div>

                )
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
                return `${row.matchType} - ${row.matchCategory}`
            },
            width: "180px",
        },
        {
            header: "Match Rack",
            accessor: () => "",
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
