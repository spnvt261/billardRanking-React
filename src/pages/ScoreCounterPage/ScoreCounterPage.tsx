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
import RackCheckTable, { type HistoryItem } from "../../components/table/rackCheck/RackCheckTable";
import { getEvents, saveEvents, syncEvents } from "../../ultils/localForage";
import type { MatchScoreEventRequest } from "../../types/matchScoreEvents";
import { HiMiniTrophy } from "react-icons/hi2";
import { matchTypeMap } from "../../ultils/mapEnum";
import FormToggle from "../../components/forms/FormToggle";

interface Props {
    isLoading: boolean;
    showLoading?: (a: boolean) => void
    getMatchById: (workspaceId: string, uuid: string) => Promise<Match>
    unlockScoreCounterByUuid: (matchUuid: string, workspaceId: string, token: string) => Promise<string>
    verifyTokenLockCounter: (matchUuid: string, workspaceId: string, token: string) => Promise<boolean>
    totalElements: number;
    getAllMatchScoreEvents: (workspaceId: string, matchId: string, page: number) => Promise<void>;
    endMatch: (matchId: string, token: string) => Promise<void>;
    pauseMatch: (matchId: string, token: string) => Promise<void>;
    cleanMatchScoreEvents:()=>Promise<void>;
}

const ScoreCounterPage: React.FC<Props> = ({
    isLoading,
    showLoading,
    getMatchById,
    verifyTokenLockCounter,
    unlockScoreCounterByUuid,
    totalElements, getAllMatchScoreEvents,
    endMatch, pauseMatch,
    cleanMatchScoreEvents
}) => {
    const { uuid } = useParams<{ uuid: string }>();
    const { state } = useLocation();
    const { notify } = useNotification()
    const navigate = useNavigate();
    const { workspaceId } = useWorkspace();
    const [matchData, setMatchData] = useState<Match | null>(null)
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState("Win");
    const [customReason, setCustomReason] = useState("");
    const [winnerId, setWinnerId] = useState<number | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [lastScoreTime, setLastScoreTime] = useState<number | null>(null);
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
    useEffect(() => {
        if (workspaceId && matchData) {
            getAllMatchScoreEvents(workspaceId, matchData.id.toString(), 1)
        }
    }, [matchData])

    if (!matchData) {
        return (
            <div className="h-screen w-screen">

            </div>
        )
    }


    const handleScoreClick = (team: 1 | 2) => {
        setShowModal(true);
        setWinnerId(team === 1 ? matchData.team1Id : matchData.team2Id);
    };

    const confirmPoint = async () => {
        const now = Date.now();
        if (lastScoreTime && now - lastScoreTime < 30000) {
            const remaining = Math.ceil((30000 - (now - lastScoreTime)) / 1000);
            notify(`Vui lòng chờ ${remaining}s trước khi cộng điểm tiếp theo.`, 'warning');
            return;
        }

        if (!storedToken) {
            notify('Không tìm thấy token khóa bảng điểm', 'error');
            return;
        }
        if (!winnerId) {
            notify('Chưa chọn đội thắng', 'error');
            return;
        }

        const note = reason === 'Khác' ? customReason : reason;
        const nextRack = totalElements + history.length + 1;

        const newScore1 = winnerId === matchData.team1Id ? score1 + 1 : score1;
        const newScore2 = winnerId === matchData.team2Id ? score2 + 1 : score2;

        const event: MatchScoreEventRequest = {
            workspaceId: workspaceId ? Number(workspaceId) : 0,
            tournamentId: matchData.tournamentId,
            matchId: matchData.id,
            teamId: winnerId,
            playerId: undefined,
            rackNumber: nextRack,
            pointsReceived: 1,
            note,
            isSynced: false,
            retryCount: 0,
            lastAttempt: null,
        };

        const prevScore1 = score1;
        const prevScore2 = score2;
        const prevHistory = [...history];

        // UI optimistic update
        setScore1(newScore1);
        setScore2(newScore2);
        setHistory(prev => [{
            rack: nextRack,
            winner: winnerId === matchData.team1Id
                ? getTeamNames(matchData.team1?.players) || 'Team 1'
                : getTeamNames(matchData.team2?.players) || 'Team 2',
            note,
            winnerId,
        }, ...prev]);
        setLastScoreTime(Date.now());

        setShowModal(false);
        setCustomReason('');

        try {
            const events = await getEvents(uuid!);
            events.push(event);
            await saveEvents(uuid!, events);

            await syncEvents(uuid!, storedToken);
            // notify('Cập nhật điểm thành công', 'success');
        } catch (err: any) {
            if (err.response?.status === 400 || err.response?.status === 401) {
                setScore1(prevScore1);
                setScore2(prevScore2);
                setHistory(prevHistory);
                notify(`Lỗi: ${err.response?.data?.message || 'Token hoặc dữ liệu không hợp lệ'}`, 'error');
                navigate(-1);
            } else {
                notify('Lỗi đồng bộ dữ liệu, đã lưu offline', 'warning');
                console.error('Sync error:', err);
            }
        }

        if (newScore1 === matchData.raceTo || newScore2 === matchData.raceTo) {
            btnEndMatch();
        }
    };


    const btnEndMatch = async () => {
        if (!storedToken) {
            notify('Token Score Counter Không tồn tại!', 'error')
            return;
        }
        cleanMatchScoreEvents()
        syncEvents(uuid!, storedToken);
        endMatch(matchData.id.toString(), storedToken).then(() => {
            navigate(-1);
            notify('Trận đấu đã kết thúc!', 'success')
        })

    };
    const btnPauseMatch = async () => {
        if (!storedToken) {
            notify('Token Score Counter Không tồn tại!', 'error')
            return;
        }
        cleanMatchScoreEvents()
        syncEvents(uuid!, storedToken);
        pauseMatch(matchData.id.toString(), storedToken).then(() => {
            navigate(-1);
            notify('Trận đấu đã tạm dừng!', 'warning')
        })

    }

    const closeAll = () => {
        setShowModal(false);
    };

    if (matchData?.status !== MatchStatus.ONGOING) {
        notify(`Trận đấu không hợp lệ !`, 'error')
        navigate(-1)
        return
    }

    const getTeamNames = (players?: Player[]) => {
        if (!players || players.length === 0) {
            return "TBA";
        }
        return players.map(p => p.name.toLocaleUpperCase()).join(" & ");
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden ">

            {/* Header */}
            <div id="header-inner" className="flex justify-between items-center py-4 px-4 border-b">
                <FormToggle
                    btnLabel="Rack"
                    Icon={<MdHistory size={24} />}
                    formTitle=""
                    padding="0"
                    btnPadding=".5rem .75rem"
                    btnVariant="type-2"
                    element={(props) => (
                        <RackCheckTable
                            matchId={matchData.id}
                            history={history}
                            team1Id={matchData.team1Id}
                            team2Id={matchData.team2Id}
                            onClose={props.btnCancel} // FormToggle tự truyền hàm này
                        />
                    )}

                />

                {/* Match Info */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-600">
                        Race to {matchData.raceTo}
                    </h1>
                    <p className="flex items-center justify-center relative text-sm text-gray-600 [@media(max-width:512px)]:flex-col">
                        {
                            matchData.matchCategory === MatchCategory.TOURNAMENT &&
                            <>{matchData.matchType && <span className="w-fit">{matchTypeMap[matchData.matchType].label}<span className="[@media(max-width:512px)]:hidden px-1">-</span></span>}
                                <span className="flex items-center justify-center"> Giải {matchData.tournamentName || "Tournament"}</span> <HiMiniTrophy className="text-yellow-500" size={20} />
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
                <FormToggle
                    btnLabel="End Match"
                    formTitle=""
                    padding="0"
                    btnPadding=".5rem .75rem"
                    btnVariant="type-4"
                    element={(props) => (
                        <>
                            <div className="bg-white px-6 pt-6 pb-2 w-full h-full text-center relative">
                                <button
                                    onClick={props.btnCancel}
                                    className="absolute top-0 right-0 px-[1rem] text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                >
                                    &times;
                                </button>

                                <h2 className="text-lg font-semibold mb-4">Kết quả trận đấu</h2>
                                <div className="flex items-center justify-center text-2xl font-bold mb-4">
                                    <span
                                        className={`text-3xl mr-2 ${score1 > score2 ? "text-green-500" : "text-red-500"}`}
                                    >{getTeamNames(matchData.team1?.players)}</span>
                                    {score1} - {score2}
                                    <span
                                        className={`text-3xl ml-2 ${score1 < score2 ? "text-green-500" : "text-red-500"}`}
                                    >{getTeamNames(matchData.team2?.players)}</span>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <CustomButton
                                        label="Tạm dừng"
                                        variant="type-8"
                                        onClick={btnPauseMatch}
                                    />
                                    {
                                        score1 != score2 && <CustomButton
                                            label="Kết thúc"
                                            variant="type-4"
                                            onClick={btnEndMatch}
                                        />
                                    }

                                </div>
                            </div>
                        </>
                    )}
                />
            </div>

            {/* Players */}
            <div className="flex flex-1 flex-col [@media(min-width:512px)]:flex-row gap-2 p-2">
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
        </div>
    );
};

// --- Redux ---
const mapStateToProps = (state: any) => ({
    isLoading: state.matches.isGetMatchLoading,
    totalElements: state.scoreEvent.totalElements,
});

const mapDispatchToProps = (dispatch: any) => ({
    getMatchById: (workspaceId: string, uuid: string) => dispatch(matchActions.getMatchById(workspaceId, uuid)),
    endMatch: (matchId: string, token: string) => dispatch(matchScoreEventActions.endMatch(matchId, token)),
    pauseMatch: (matchId: string, token: string) => dispatch(matchScoreEventActions.pauseMatch(matchId, token)),
    unlockScoreCounterByUuid: (matchUuid: string, workspaceId: string, token: string) => dispatch(matchScoreEventActions.unlockScoreCounterByUuid(matchUuid, workspaceId, token)),
    verifyTokenLockCounter: (matchUuid: string, workspaceId: string, token: string) => dispatch(matchScoreEventActions.verifyTokenLockCounter(matchUuid, workspaceId, token)),
    getAllMatchScoreEvents: (workspaceId: string, matchId: string, page: number) => dispatch(matchScoreEventActions.getAllMatchScoreEvents(workspaceId, matchId, page)),
    cleanMatchScoreEvents: ()=>dispatch(matchScoreEventActions.cleanData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WithLoading(ScoreCounterPage));
