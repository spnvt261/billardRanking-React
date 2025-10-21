import { useEffect, useState } from "react";
import { connect } from "react-redux";
import DataTable from "../DataTable";
import Pagination from "../pagination/Pagination";
import playerActions from "../../../redux/features/player/playerActions";
import "./RankingTable.css";
import type { Player } from "../../../types/player";
import { useWorkspace } from "../../../customhook/useWorkspace";
import { useNotification } from "../../../customhook/useNotifycation";
import { formatFullVND } from "../../../ultils/format";

interface RankingTableProps {
    isLoading: boolean;
    totalElements: number;
    totalPages: number;
    page: number;
    playersByPage: Record<number, Player[]>;
    getAllPlayer: (workspaceId: string, page: number) => Promise<void>;
    getAllPlayerSortedByPrize: (workspaceId: string, page: number) => Promise<void>;
    cleanPlayers: ()=> void;
}

const RankingTable: React.FC<RankingTableProps> = ({
    isLoading,
    totalElements,
    getAllPlayer,
    getAllPlayerSortedByPrize,
    cleanPlayers,
    playersByPage,
}) => {
    // console.log(playersByPage);
    
    // console.log("ranking table");
    const { notify } = useNotification();
    const [mode, setMode] = useState<"elo" | "prize">("elo");
    const [currentPage, setCurrentPage] = useState(1);
    const { workspaceId } = useWorkspace();
    useEffect(() => {
        if (!playersByPage[currentPage] && mode=="elo") {
            if (workspaceId) getAllPlayer(workspaceId, currentPage).catch(err => {
                notify(`Lỗi kết nối tới sever ${err}`, 'error');
            });
        }
        if (!playersByPage[currentPage] && mode=="prize") {
            if (workspaceId) getAllPlayerSortedByPrize(workspaceId, currentPage).catch(err => {
                notify(`Lỗi kết nối tới sever ${err}`, 'error');
            });
        }
    }, [currentPage, playersByPage]);

    const currentData = playersByPage[currentPage] || [];

    return (
        <div className="ranking-table-wrapped">
            {/* ----- Toggle ELO / PRIZE ----- */}
            <div className="flex relative font-bold">
                <div
                    className="hightlight-block absolute top-0 h-full w-full transition-all duration-500 shadow-md"
                    style={{
                        left: mode === "elo" ? "-25%" : "25%",
                        borderBottomLeftRadius: mode === "elo" ? "1rem" : "0",
                        borderBottomRightRadius: mode === "prize" ? "1rem" : "0",
                        borderTopLeftRadius: "2rem",
                        borderTopRightRadius: "2rem",
                        transform: "scaleX(1.05)",
                    }}
                ></div>
                <div
                    className={`z-10 text-center py-2 cursor-pointer transition-all duration-500 ${mode === "elo" ? "text-white w-3/4" : "text-black w-1/4"
                        }`}
                    onClick={() => {setMode("elo"); cleanPlayers()}}
                >
                    Elo
                </div>
                <div
                    className={`z-10 text-center py-2 cursor-pointer transition-all duration-500 ${mode === "prize" ? "text-white w-3/4" : "text-black w-1/4"
                        }`}
                    onClick={() => { setMode("prize"); cleanPlayers() }}
                >
                    Tiền
                </div>
            </div>

            {/* ----- Table ----- */}
            <DataTable<Player>
                key={`page-${currentPage}`}
                columns={[
                    { header: "Rank", accessor: "rank", width: "10%" },
                    {
                        header: "Player",
                        accessor: (item: Player) => (
                            <div className="flex items-center gap-2">
                                <img
                                    src={item.avatarUrl || "images/avataDefault.png"}
                                    alt={item.name}
                                    className="w-20 h-20 bg-gray-200 overflow-hidden rounded-[1rem]"
                                />
                                <span className="max-w-[100px] truncate">{item.name}</span>
                            </div>
                        ),
                        width: "60%",
                    },
                    {
                        header: mode === "elo" ? "Elo" : "Prize",
                        accessor: (item: Player) =>
                            mode === "elo" ? item.elo : formatFullVND(item.prize),
                        width: "30%",
                    },
                ]}
                data={currentData}
                isLoading={isLoading}
                totalElement={totalElements}
            />

            {/* ----- Pagination ----- */}
            <Pagination
                currentPage={currentPage}
                totalItems={totalElements}
                pageSize={10}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

const mapStateToProps = (state: any) => ({
    isLoading: state.players.isLoading,
    playersByPage: state.players.playersByPage,
    totalElements: state.players.totalElements,
    totalPages: state.players.totalPages,
    page: state.players.page,
});

const mapDispatchToProps = (dispatch: any) => ({
    getAllPlayer: (workspaceId: string, page: number) =>dispatch(playerActions.getPlayers(workspaceId, page)),
    getAllPlayerSortedByPrize: (workspaceId: string, page: number) =>dispatch(playerActions.getAllPlayerSortedByPrize(workspaceId, page)),
    cleanPlayers: () =>dispatch(playerActions.cleanPlayers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RankingTable);
