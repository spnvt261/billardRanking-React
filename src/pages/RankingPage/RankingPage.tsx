import { useCallback, useMemo, useRef, useState } from "react";
import { players } from "../../components/data/rankingData";
import DataTable from "../../components/table/DataTable";
import { getSortedPlayers } from "../../ultils/sortPlayerRanking";
import "./RankingPage.css"
import CustomButton from "../../components/customButtons/CustomButton";
import AddPlayerForm from "../../components/forms/addPlayerForm/AddPlayerForm";
import Pagination from "../../components/pagination/Pagination";

const RankingPage = () => {
    console.log('RankingPage');
    const [mode, setMode] = useState<"elo" | "prize">("elo");
    const [showForm, setShowForm] = useState(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const btnRef = useRef<HTMLButtonElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const btnAddPlayer = useCallback(() => {
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setOrigin({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
        }
        setShowForm(true);

    }, []);
    const _onCloseForm = useCallback(() => setShowForm(false), []);
    const sortedPlayers = useMemo(() => getSortedPlayers(players, mode), [mode]);

    const paginatedPlayers = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return sortedPlayers.slice(start, end);
    }, [sortedPlayers, currentPage]);
    return (
        <div className="ranking-page">
            <h2 className="text-2xl font-bold">Friend Ranking</h2>

            <CustomButton
                ref={btnRef}
                label="Thêm cơ thủ"
                variant="type-7"
                onClick={btnAddPlayer}
            />
            <div className="w-full border mt-4 bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex relative font-bold">
                    <div
                        className={`hightlight-block absolute top-0 h-full w-full bg-gray-400 transition-all duration-500 shadow-md`}
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
                <DataTable
                    key={`page-${currentPage}`}
                    columns={[
                        { header: "Rank", accessor: "rank", width: "10%" },
                        {
                            header: "Player",
                            accessor: (item) => (
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
                            accessor: (item) => (mode === "elo" ? item.elo : `$${item.prize}`),
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
            <AddPlayerForm
                isOpen={showForm}
                onClose={_onCloseForm}
                origin={origin} // Truyền vị trí button
            />
        </div >
    );
}

export default RankingPage