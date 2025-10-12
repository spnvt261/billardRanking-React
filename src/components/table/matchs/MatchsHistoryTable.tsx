import { useMemo, useState } from "react";
import { listMatches, type Match } from "../../../data/matchData"
import DataTable from "../DataTable"
import Pagination from "../../pagination/Pagination";


const MatchesHistoryTable = () => {
    console.log('Matches Table');

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    const paginatedMatches:Match[] = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return listMatches.slice(start, start + pageSize);
    }, [listMatches, currentPage]);
    const columns = [
        {
            header: "Match",
            accessor: (row: Match) => {
                const isTeam1Winner = row.winner_side === "team1"
                const isTeam2Winner = row.winner_side === "team2"

                return (
                    <div className="font-medium">
                        <span className={isTeam1Winner ? "text-green-600" : "text-red-600"}>
                            {row.team1.name}
                        </span>{" "}
                        <span className="text-gray-800">
                            {row.score_team1} - {row.score_team2}
                        </span>{" "}
                        <span className={isTeam2Winner ? "text-green-600" : "text-red-600"}>
                            {row.team2.name}
                        </span>
                    </div>
                )
            },
            width: "300px",
        },
        {
            header: "Date",
            accessor: (row: Match) => {
                const date = new Date(row.match_date)
                return date.toLocaleDateString("vi-VN")
            },
            width: "100px",
        },
        {
            header: "Type",
            accessor: (row: Match) => {
                if (row.tournament_name === "Bàn nước") return "Bàn nước"
                return `${row.match_type} - ${row.tournament_name}`
            },
            width: "150px",
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
                    <DataTable<Match> key={`page-${currentPage}`} columns={columns} data={paginatedMatches} />
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalItems={listMatches.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default MatchesHistoryTable
