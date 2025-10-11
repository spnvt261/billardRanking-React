import { useMemo, useState } from "react";
import { players, type Player } from "../../../data/rankingData"
import DataTable from "../DataTable"
import Pagination from "../../pagination/Pagination";
import { getSortedPlayers } from "../../../ultils/sortPlayerRanking";
import { connect } from "react-redux";
import './RankingTable.css'

const RankingTable = () => {
    // console.log('RankingTable');
    const [currentPage, setCurrentPage] = useState(1);
    const [mode, setMode] = useState<"elo" | "prize">("elo");
    const pageSize = 10;
    const sortedPlayers = useMemo(() => getSortedPlayers(players, mode), [mode]);
    const paginatedPlayers: Player[] = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return sortedPlayers.slice(start, end);
    }, [sortedPlayers, currentPage]);
    return (
        <div className="ranking-table-wrapped">
            <div className="flex relative font-bold">
                <div
                    className={`hightlight-block absolute top-0 h-full w-full transition-all duration-500 shadow-md`}
                    style={{
                        left: mode === "elo" ? "-25%" : "25%",
                        borderBottomLeftRadius: mode === "elo" ? "1rem" : "0",
                        borderBottomRightRadius: mode === "prize" ? "1rem" : "0",
                        borderTopLeftRadius: "2rem",
                        borderTopRightRadius: "2rem",
                        transform: "scaleX(1.05)", // làm khối rộng hơn 1 chút
                    }}
                ></div>
                <div
                    className={` z-10 text-center py-2 cursor-pointer transition-all duration-500 ${mode === "elo" ? "text-white w-3/4" : "text-black w-1/4"
                        }`}
                    onClick={() => setMode("elo")}
                >
                    Elo
                </div>
                <div
                    className={` z-10 text-center py-2 cursor-pointer transition-all duration-500 ${mode === "prize" ? "text-white w-3/4" : "text-black w-1/4"
                        }`}
                    onClick={() => setMode("prize")}
                >
                    Tiền
                </div>
            </div>
            <DataTable<Player>
                key={`page-${currentPage}`}
                columns={[
                    { header: "Rank", accessor: "rank", width: "10%" },
                    {
                        header: "Player",
                        accessor: (item: Player) => (
                            <div className="flex items-center gap-2">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 bg-red-400 overflow-hidden rounded-[1rem]"
                                />
                                <span>{item.name}</span>
                            </div>
                        ),
                        width: "60%",
                    },
                    {
                        header: mode === "elo" ? "Elo" : "Prize",
                        accessor: (item: Player) => (mode === "elo" ? item.elo : `$${item.prize}`),
                        width: "30%",
                    },
                ]}
                data={paginatedPlayers}
            />
            <Pagination
                currentPage={currentPage}
                totalItems={sortedPlayers.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}
const mapStateToProps = () => {
    return {

    }
}

const mapDispatchToProp = () => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProp)(RankingTable)