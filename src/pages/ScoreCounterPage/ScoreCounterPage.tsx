import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { MatchCategory, MatchStatus, type Match } from "../../types/match";
import WithLoading from "../../components/loading/WithLoading";
import { useNotification } from "../../customhook/useNotifycation";
import { MdHistory } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import matchActions from "../../redux/features/match/matchActions";
import { useWorkspace } from "../../customhook/useWorkspace";
import { formatVND } from "../../ultils/format";
import type { Player } from "../../types/player";
import matchScoreEventActions from "../../redux/features/matchScoreEvent/matchScoreEventActions";
import { LOCAL_STORAGE_TOKEN_LOCK_SCORE_COUNTER } from "../../constants/localStorage";
import { scoreCounterReasonOptions } from "../../constants/matchTypes";
import CustomSelect from "../../components/customSelect/CustomSelect";
import CustomTextField from "../../components/customTextField/CustomTextField";
import CustomButton from "../../components/customButtons/CustomButton";
import RackCheckTable from "../../components/table/rackCheck/RackCheckTable";
import { getEvents, saveEvents, syncEvents } from "../../ultils/localForage";
import type { MatchScoreEventRequest } from "../../types/matchScoreEvents";
import { HiMiniTrophy } from "react-icons/hi2";
import { matchTypeMap } from "../../ultils/mapEnum";

interface Props {
    isLoading: boolean;
    showLoading?: (a: boolean) => void
    getMatchById: (workspaceId: string, uuid: string) => Promise<Match>
    unlockScoreCounterByUuid: (matchUuid: string, workspaceId: string, token: string) => Promise<string>
    verifyTokenLockCounter: (matchUuid: string, workspaceId: string, token: string) => Promise<boolean>

}

const ScoreCounterPage: React.FC<Props> = ({ isLoading, showLoading, getMatchById, verifyTokenLockCounter, unlockScoreCounterByUuid }) => {
    const { uuid } = useParams<{ uuid: string }>();
    const { state } = useLocation();
    const { notify } = useNotification()
    const navigate = useNavigate();
    const { workspaceId } = useWorkspace();
    const [matchData, setMatchData] = useState<Match | null>(null)
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [reason, setReason] = useState("Win");
    const [customReason, setCustomReason] = useState("");
    const [winnerId, setWinnerId] = useState<number | null>(null);
    const [history, setHistory] = useState<{ rack: number; winner: string; note: string }[]>([])
    const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_LOCK_SCORE_COUNTER);
    // --- Khi có matchData ---
    useEffect(() => {
        if (matchData) {
            setScore1(matchData.scoreTeam1);
            setScore2(matchData.scoreTeam2);
        }
    }, [matchData]);
    useEffect(() => {
        if (!matchData && workspaceId && uuid && !state?.match) {
            const fetchMatch = async () => {
                try {
                    if (!storedToken) {
                        notify('Invalid Token!', 'error');
                        navigate(-1);
                    } else {
                        const isValid = await verifyTokenLockCounter(uuid, workspaceId, storedToken);
                        if (!isValid) {
                            notify('Invalid Token!', 'error');
                            throw new Error("Token invalid");
                        }
                    }
                    const data = await getMatchById(workspaceId, uuid);
                    setMatchData(data);
                } catch (error) {
                    notify('Bảng tỉ số này đã có người sử dụng!', 'error');
                    navigate(-1);
                }
            };
            fetchMatch();
        } else {
            setMatchData(state?.match)
        }

        // Đồng bộ offline events
        let refreshInterval: ReturnType<typeof setInterval> | null = null;
        if (uuid && workspaceId && storedToken) {
            refreshInterval = setInterval(() => {
                matchScoreEventActions.refreshScoreCounterLockByUuid(uuid, workspaceId, storedToken).catch(err => {
                    console.error("Failed to refresh lock:", err);
                });
            }, 60000);

            // Đồng bộ khi mount hoặc online
            const handleOnline = () =>
                syncEvents(uuid, storedToken).then((events) => {
                    if (events.every((e) => e.isSynced)) {
                        notify('Đã đồng bộ tất cả dữ liệu', 'success');
                    } else {
                        notify('Có một số dữ liệu chưa đồng bộ, sẽ thử lại sau', 'warning');
                    }
                });

            window.addEventListener('online', handleOnline);
            syncEvents(uuid, storedToken).catch((err) => {
                console.error('Sync error:', err);
            });

            return () => {
                window.removeEventListener('online', handleOnline);
                if (refreshInterval) clearInterval(refreshInterval);
                if (uuid && workspaceId && storedToken) {
                    unlockScoreCounterByUuid(uuid, workspaceId, storedToken).then(() => {
                        localStorage.removeItem(LOCAL_STORAGE_TOKEN_LOCK_SCORE_COUNTER);
                    });
                }
            };
        }
    }, [])
    useEffect(() => {
        if (showLoading) showLoading(isLoading)
    }, [isLoading])

    if (!matchData) {
        return
    }

    const handleScoreClick = (team: 1 | 2) => {
        setShowModal(true);
        setWinnerId(team === 1 ? matchData.team1Id : matchData.team2Id);
    };

    const confirmPoint = async () => {
        if (!storedToken) {
            notify('Không tìm thấy token khóa bảng điểm', 'error');
            return;
        }

        const note = reason === 'Khác' ? customReason : reason;
        const nextRack = history.length + 1;
        const event: MatchScoreEventRequest = {
            workspaceId: workspaceId ? Number(workspaceId) : 0,
            tournamentId: matchData.tournamentId,
            matchId: matchData.id,
            teamId: winnerId!,
            playerId: undefined, // Nếu cần, lấy từ matchData.teamX.players
            rackNumber: nextRack,
            pointsReceived: 1,
            note,
            isSynced: false,
            retryCount: 0,
            lastAttempt: null,
        };

        // Lưu vào offline
        const events = await getEvents(uuid!);
        events.push(event);
        await saveEvents(uuid!, events);

        // Cập nhật UI (optimistic update)
        if (winnerId === matchData.team1Id) {
            setScore1((s) => s + 1);
            setHistory([...history, { rack: nextRack, winner: matchData.team1?.name || 'Team 1', note }]);
        } else if (winnerId === matchData.team2Id) {
            setScore2((s) => s + 1);
            setHistory([...history, { rack: nextRack, winner: matchData.team2?.name || 'Team 2', note }]);
        }

        // Thử đồng bộ
        await syncEvents(uuid!, storedToken).catch((err) => {
            notify('Lỗi đồng bộ dữ liệu, đã lưu offline', "warning");
            console.log(err);

        });

        setShowModal(false);
        setCustomReason('');
    };

    const endMatch = () => {
        setShowResult(true)
    };
    // const endMatch = async () => {
    //     if (!storedToken) {
    //         notify('Không tìm thấy token khóa bảng điểm', 'error');
    //         return;
    //     }

    //     // Đồng bộ tất cả events
    //     const events = await syncEvents(uuid!, storedToken);
    //     if (events.some((e) => !e.isSynced)) {
    //         notify('Vẫn còn dữ liệu chưa đồng bộ, vui lòng thử lại', 'warning');
    //         return;
    //     }

    //     const finalData = { score1, score2, history, status: MatchStatus.FINISHED };
    //     try {
    //         await dispatch(matchActions.endMatch(workspaceId, uuid!, finalData));
    //         await clearEvents(uuid!); // Xóa dữ liệu offline
    //         setShowResult(true);
    //         notify('Trận đấu kết thúc thành công', 'success');
    //     } catch {
    //         await saveEvents(uuid!, [{ ...finalData, isSynced: false, retryCount: 0, lastAttempt: null }]);
    //         notify('Kết thúc trận lưu tạm, sẽ sync khi online', 'warning');
    //         setShowResult(true);
    //     }
    // };
    const closeAll = () => {
        setShowModal(false);
        setShowHistory(false);
        setShowResult(false);
    };

    if (matchData?.status !== MatchStatus.ONGOING) {
        notify(`Trận đấu không hợp lệ !`, 'error')
        return
    }

    const getTeamNames = (players?: Player[]) => {
        if (!players || players.length === 0) {
            return "TBA";
        }
        return players.map(p => p.name).join(" & ");
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden fixed inset-0">

            {/* Header */}
            <div id="header-inner" className="flex justify-between items-center py-4 px-4 border-b">
                {/* View History */}
                <button onClick={() => setShowHistory(true)} type="button" className="p-2 rounded-lg flex bg-blue-400 hover:bg-blue-600">
                    <span className="span-text-hide-moblie mr-2">Rack check</span>
                    <MdHistory size={24} />
                </button>

                {/* Match Info */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-600">
                        Race to {matchData.raceTo}
                    </h1>
                    <p className="flex text-sm text-gray-600">
                        {
                            matchData.matchCategory === MatchCategory.TOURNAMENT &&
                            <>{matchData.matchType && <span>{matchTypeMap[matchData.matchType].label} -</span>}
                                <span className="flex items-center"> - Giải {matchData.tournamentName || "Tournament"} <HiMiniTrophy  className="ml-1 text-yellow-500 " size={20} /></span>
                            </>

                        }
                        {
                            matchData.matchCategory === MatchCategory.FUN && <span>Bàn nước</span>
                        }
                        {
                            matchData.matchCategory === MatchCategory.BETTING && <span>Kèo {matchData.betAmount ? formatVND(matchData.betAmount) : "Tiền"}</span>
                        }

                    </p>
                </div>

                {/* End Match */}
                <button onClick={endMatch} className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                    End <span className="[@media(max-width:512px)]:hidden">Match</span>
                </button>
            </div>

            {/* Players */}
            <div className="flex flex-1 flex-col md:flex-row gap-2 p-2">
                {/* Player 1 */}
                <div
                    onClick={() => handleScoreClick(1)}
                    className={`active:scale-[0.98] transition-all duration-100 flex-1 flex flex-col items-center justify-center bg-blue-500 text-white text-4xl md:text-5xl font-bold cursor-pointer py-8 rounded-lg
                            
                        `}

                >
                    <div className="player-content flex-1 flex flex-col items-center justify-center">
                        <span className="mb-4 text-6xl">{getTeamNames(matchData.team1?.players)}</span>
                        <span className="text-4xl">{score1}</span>
                    </div>
                </div>

                {/* Player 2 */}
                <div
                    onClick={() => handleScoreClick(2)}
                    className="active:scale-[0.98] border-2 transition-all duration-100 flex-1 flex flex-col items-center justify-center bg-red-500 text-white text-4xl md:text-5xl font-bold cursor-pointer py-8 rounded-lg"
                >
                    <div className="player-content flex-1 flex flex-col items-center justify-center">
                        <span className="mb-4 text-6xl">{getTeamNames(matchData.team2?.players)}</span>
                        <span className="text-4xl">{score2}</span>
                    </div>
                </div>
            </div>

            {/* Modal xác nhận */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className={`bg-white border-2 p-6 rounded-xl shadow-xl w-96
                            ${winnerId === matchData.team1Id ? "border-blue-600" : "border-red-600"}
                        `}>
                        <h2 className="text-lg font-semibold mb-4 text-slate-500">XÁC NHẬN
                            {
                                winnerId === matchData.team1Id
                                    ? <span className="text-lg font-semibold text-blue-600"> {getTeamNames(matchData.team1?.players)} </span>
                                    : <span className="text-lg font-semibold text-red-600"> {getTeamNames(matchData.team2?.players)} </span>
                            }
                            WIN RACK NÀY?
                        </h2>

                        <label className="block text-sm">Note</label>
                        <CustomSelect
                            options={scoreCounterReasonOptions}
                            placeholder="Chọn lý do"
                            value={reason ? [reason] : []}
                            onChange={(values) => setReason(values[0] || "")}
                            className="mb-4"
                        />

                        {reason === "Khác" && (
                            <CustomTextField
                                label="Mô tả"
                                name="customReason"
                                onChange={(e) => setCustomReason(e.target.value)}
                                className="mt-2 mb-2"
                            />
                        )}

                        <div className="flex justify-end gap-2">
                            <CustomButton
                                label="Đóng"
                                variant="type-4"
                                onClick={closeAll}
                            />
                            <CustomButton
                                label="Xác nhận"
                                variant="type-3"
                                onClick={confirmPoint}
                            />
                        </div>
                    </div>
                </div>
            )}


            {/* History Modal */}
            {showHistory && (
                <RackCheckTable
                    history={history}
                    onClose={closeAll}
                    show
                />
            )}

            {/* Result Modal */}
            {showResult && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-black bg-opacity-30 fixed inset-0 z-10"></div>
                    <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] text-center z-50 relative">
                        <h2 className="text-lg font-semibold mb-4">Kết quả trận đấu</h2>
                        <div className="text-2xl font-bold mb-4">
                            {matchData.team1?.name} {score1} - {score2} {matchData.team2?.name}
                        </div>
                        <div className="flex justify-center gap-3">
                            <button onClick={closeAll} className="px-4 py-2 rounded bg-gray-300">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Redux ---
const mapStateToProps = (state: any) => ({
    isLoading: state.matches.isGetMatchLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
    getMatchById: (workspaceId: string, uuid: string) => dispatch(matchActions.getMatchById(workspaceId, uuid)),
    unlockScoreCounterByUuid: (matchUuid: string, workspaceId: string, token: string) => dispatch(matchScoreEventActions.unlockScoreCounterByUuid(matchUuid, workspaceId, token)),
    verifyTokenLockCounter: (matchUuid: string, workspaceId: string, token: string) => dispatch(matchScoreEventActions.verifyTokenLockCounter(matchUuid, workspaceId, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(WithLoading(ScoreCounterPage));
