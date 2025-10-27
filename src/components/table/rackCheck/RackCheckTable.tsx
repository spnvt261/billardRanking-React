import React, { useEffect, useState } from "react";
import DataTable from "../DataTable";
import WithLoading from "../../loading/WithLoading";
import { connect } from "react-redux";
import matchScoreEventActions from "../../../redux/features/matchScoreEvent/matchScoreEventActions";
import type { MatchScoreEvent } from "../../../types/matchScoreEvents";
import Pagination from "../pagination/Pagination";
import { useWorkspace } from "../../../customhook/useWorkspace";
import { useNotification } from "../../../customhook/useNotifycation";

export interface HistoryItem {
    winnerId: number;
    rack: number;
    winner: string;
    note: string;
}

interface RackCheckTableProps {
    team1Id?: number;
    team2Id?: number;
    matchId: number;
    history?: HistoryItem[];
    onClose: () => void;
    totalElements: number;
    isLoading: boolean;
    totalPages: number;
    listDataByPage: Record<number, MatchScoreEvent[]>;
    getAllMatchScoreEvents: (workspaceId: string, matchId: string, page: number) => Promise<void>
}

const RackCheckTable: React.FC<RackCheckTableProps> = ({
    team1Id,
    team2Id,
    matchId,
    history,
    onClose,
    isLoading,
    totalElements,
    listDataByPage,
    getAllMatchScoreEvents
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { workspaceId } = useWorkspace();
    const { notify } = useNotification();
    console.log(1);
    
    useEffect(() => {
        if (!listDataByPage[currentPage]) {
            if (workspaceId) getAllMatchScoreEvents(workspaceId, matchId.toString(), currentPage).catch(err => {
                notify(`Lỗi kết nối tới sever ${err}`, 'error');
            });
        }
    }, [currentPage, listDataByPage]);

    const currentData = listDataByPage[currentPage] || [];

    const columns = [
        { header: "Rack", accessor: "rack", width: "20%" },
        { header: "Winner", accessor: "winner", width: "40%" },
        { header: "Note", accessor: "note", width: "40%" },
    ];

    const getTeamNames = (players?: { name: string }[]) => {
        if (!players || players.length === 0) {
            return "TBA";
        }
        return players.map(p => p.name).join(" & ");
    };

    const columnsHistory = [
        {
            header: "Rack",
            accessor: (row: MatchScoreEvent) => row.rackNumber,
            width: "20%",
        },
        {
            header: "Winner",
            accessor: (row: MatchScoreEvent) => getTeamNames(row.team.players) || row.team.name || "—",
            width: "40%",
        },
        {
            header: "Note",
            accessor: (row: MatchScoreEvent) => row.note || "—",
            width: "40%",
        },
    ];


    // ✅ Hàm xác định màu nền cho từng hàng
    const getRowClassName = (row: HistoryItem) => {
        if (team1Id && row.winnerId === team1Id) return "bg-blue-300 hover:bg-blue-400";
        if (team2Id && row.winnerId === team2Id) return "bg-red-300 hover:bg-red-400";
        return "";
    };

    const getRowClassNameHistory = (() => {
        // Lưu mapping giữa teamId và màu
        const teamColorMap = new Map<number, string>();

        return (
            row: MatchScoreEvent,
            team1Id?: number,
            team2Id?: number
        ): string => {
            // Nếu có team1Id / team2Id được truyền → ưu tiên dùng
            if (team1Id && row.teamId === team1Id)
                return "bg-blue-300 hover:bg-blue-400";
            if (team2Id && row.teamId === team2Id)
                return "bg-red-300 hover:bg-red-400";

            // Nếu không truyền team1Id/team2Id → tự gán màu theo teamId
            if (!teamColorMap.has(row.teamId)) {
                if (teamColorMap.size === 0) {
                    teamColorMap.set(row.teamId, "bg-blue-300 hover:bg-blue-400");
                } else if (teamColorMap.size === 1) {
                    teamColorMap.set(row.teamId, "bg-red-300 hover:bg-red-400");
                } else {
                    // Nếu có thêm teamId thứ 3 → dùng màu mặc định
                    teamColorMap.set(row.teamId, "");
                }
            }

            return teamColorMap.get(row.teamId) || "";
        };
    })();


    // ✅ Màu cho từng header (ví dụ: tô nhẹ tiêu đề)
    const getHeaderClass = (col: any) => {
        if (col.header === "Rack") return "bg-slate-500 text-white";
        if (col.header === "Winner") return "bg-slate-500 text-white ";
        if (col.header === "Note") return "bg-slate-500 text-white";
        return "";
    };

    return (
        <>
        {/* // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2"> */}
            {/* // <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-y-auto hide-scrollbar"> */}
                {
                    history && history?.length > 0 && <>
                        {/* Header */}
                        <div className="flex justify-between items-center border-b px-4 py-2">
                            <h2 className="text-lg font-bold text-slate-600">New Racks</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4">
                            <DataTable<HistoryItem>
                                columns={columns}
                                data={history}
                                totalElement={history.length}
                                isLoading={false}
                                getRowClassName={getRowClassName}
                                getHeaderClass={getHeaderClass}
                                minHeight="200px"
                            />
                        </div>
                    </>
                }

                {/* Header */}
                <div className="flex justify-between items-center border-b px-4 py-2">
                    <h2 className="text-lg font-bold text-slate-600">History Rack Check</h2>
                    {
                        (!history || history?.length === 0) && <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            &times;
                        </button>
                    }
                </div>

                {/* Body */}
                <div className="p-4">
                    <DataTable<MatchScoreEvent>
                        columns={columnsHistory}
                        data={currentData}
                        totalElement={totalElements}
                        isLoading={isLoading}
                        getRowClassName={(row) => getRowClassNameHistory(row, team1Id, team2Id)}
                        getHeaderClass={getHeaderClass}
                    />
                    <Pagination
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        pageSize={10}
                        totalItems={totalElements}
                    />
                </div>
            {/* // </div> */}
        {/* // </div> */}
        </>
    );
};

// --- Redux ---
const mapStateToProps = (state: any) => ({
    isLoading: state.scoreEvent.isGetDataLoading,
    totalElements: state.scoreEvent.totalElements,
    totalPages: state.scoreEvent.totalPages,
    listDataByPage: state.scoreEvent.listDataByPage,
});

const mapDispatchToProps = (dispatch: any) => ({
    getAllMatchScoreEvents: (workspaceId: string, matchId: string, page: number) => dispatch(matchScoreEventActions.getAllMatchScoreEvents(workspaceId, matchId, page))
});

export default connect(mapStateToProps, mapDispatchToProps)(WithLoading(RackCheckTable));
