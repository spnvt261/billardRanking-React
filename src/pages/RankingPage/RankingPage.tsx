import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type JSX } from "react";
import { players, type Player } from "../../components/data/rankingData";
import DataTable from "../../components/table/DataTable";
import { getSortedPlayers } from "../../ultils/sortPlayerRanking";
import "./RankingPage.css"
import CustomButton from "../../components/customButtons/CustomButton";
import AddPlayerForm, { type ChildHandle } from "../../components/forms/addPlayerForm/AddPlayerForm";
import Pagination from "../../components/pagination/Pagination";
import { connect } from "react-redux";
import viewActions from "../../redux/ui/viewActions";

const RankingPage = (props: any) => {
    const { openAddPlayerForm } = props;
    console.log('RankingPage');
    const [mode, setMode] = useState<"elo" | "prize">("elo");
    const btnRef = useRef<HTMLButtonElement>(null);
    const formRef = useRef<ChildHandle>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const btnAddPlayer = useCallback(() => {
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            const coords = { x: rect.x, y: rect.y,width:rect.width,height:rect.height };
            formRef.current?.updateCoords(coords);
            
            // console.log(coords);
        }
        openAddPlayerForm()

    }, []);

    const sortedPlayers = useMemo(() => getSortedPlayers(players, mode), [mode]);

    const paginatedPlayers: Player[] = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return sortedPlayers.slice(start, end);
    }, [sortedPlayers, currentPage]);

    useEffect(() => {
        
    }, [])
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
            <AddPlayerForm ref={formRef}/>
            
        </div >
    );
}

const mapStateToProps = (state: any) => {
    return {

    }
}

const mapDispatchToProp = (dispatch: any) => {
    return {
        openAddPlayerForm: () => dispatch(viewActions.openAddPlayerForm())
    }
}

export default connect(mapStateToProps, mapDispatchToProp)(RankingPage)