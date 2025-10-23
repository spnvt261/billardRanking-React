import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import type { Match } from "../../types/match";
import matchActions from "../../redux/features/match/matchActions";
import WithLoading from "../../components/loading/WithLoading";
import { useWorkspace } from "../../customhook/useWorkspace";

interface Props {
    match?: Match | null;
    isLoading: boolean;
    getMatchById: (workspaceId: string, id: number) => Promise<any>;
    showLoading?: (a: boolean) => void
}

const ScoreCounterPage: React.FC<Props> = ({ match: matchData, isLoading, getMatchById, showLoading }) => {
    const { id } = useParams<{ id: string }>();
    const { workspaceId } = useWorkspace();
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [reason, setReason] = useState("Win");
    const [customReason, setCustomReason] = useState("");
    const [winnerId, setWinnerId] = useState<number | null>(null);
    const [history, setHistory] = useState<{ rack: number; winner: string; note: string }[]>([]);

    // --- Fetch match data ---
    useEffect(() => {
        if (id && workspaceId) {
            getMatchById(workspaceId, Number(id));
        }
    }, [id, workspaceId]);

    // --- Khi có matchData ---
    useEffect(() => {
        if (matchData) {
            setScore1(matchData.scoreTeam1);
            setScore2(matchData.scoreTeam2);
        }
    }, [matchData]);

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

    const confirmPoint = () => {
        const note = reason === "Khác" ? customReason : reason;
        const nextRack = history.length + 1;

        if (winnerId === matchData.team1Id) {
            setScore1((s) => s + 1);
            setHistory([...history, { rack: nextRack, winner: matchData.team1?.name || "Team 1", note }]);
        } else if (winnerId === matchData.team2Id) {
            setScore2((s) => s + 1);
            setHistory([...history, { rack: nextRack, winner: matchData.team2?.name || "Team 2", note }]);
        }

        setShowModal(false);
        setCustomReason("");
    };

    const endMatch = () => setShowResult(true);
    const closeAll = () => {
        setShowModal(false);
        setShowHistory(false);
        setShowResult(false);
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden fixed inset-0">

            {/* Header */}
            <div id="header-inner" className="flex justify-between items-center py-4 px-4 border-b">
                {/* View History */}
                <button onClick={() => setShowHistory(true)} className="p-2 rounded-lg flex bg-blue-400 hover:bg-blue-600">
                    <span className="span-text-hide-moblie mr-2">View History</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 513.11" className="w-6 h-6 fill-current text-gray-700">
                        <path
                            fillRule="nonzero"
                            d="M210.48 160.8c0-14.61 11.84-26.46 26.45-26.46s26.45 11.85 26.45 26.46v110.88l73.34 32.24c13.36 5.88 19.42 21.47 13.54 34.82-5.88 13.35-21.47 19.41-34.82 13.54l-87.8-38.6c-10.03-3.76-17.16-13.43-17.16-24.77V160.8z"
                        />
                    </svg>
                </button>

                {/* Match Info */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-600">
                        Race to {Math.max(score1, score2) + 3}
                    </h1>
                    <p className="text-sm text-gray-600">
                        <span>{matchData.tournamentName || "Tournament"}</span>
                        {matchData.matchType && <span> - {matchData.matchType}</span>}
                    </p>
                </div>

                {/* End Match */}
                <button onClick={endMatch} className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                    End <span className="span-text-hide-moblie">Match</span>
                </button>
            </div>

            {/* Players */}
            <div className="flex flex-1 flex-col md:flex-row gap-2 p-2">
                {/* Player 1 */}
                <div
                    onClick={() => handleScoreClick(1)}
                    className="flex-1 flex flex-col items-center justify-center bg-blue-500 text-white text-4xl md:text-5xl font-bold cursor-pointer py-8 rounded-lg"
                >
                    <div className="player-content flex-1 flex flex-col items-center justify-center">
                        <span className="mb-4">{matchData.team1?.name || "Player 1"}</span>
                        <span className="text-7xl">{score1}</span>
                    </div>
                </div>

                {/* Player 2 */}
                <div
                    onClick={() => handleScoreClick(2)}
                    className="flex-1 flex flex-col items-center justify-center bg-red-500 text-white text-4xl md:text-5xl font-bold cursor-pointer py-8 rounded-lg"
                >
                    <div className="player-content flex-1 flex flex-col items-center justify-center">
                        <span className="mb-4">{matchData.team2?.name || "Player 2"}</span>
                        <span className="text-7xl">{score2}</span>
                    </div>
                </div>
            </div>

            {/* Modal xác nhận */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
                        <label className="block mb-2 text-sm">Mô tả:</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border rounded px-2 py-1 mb-2"
                        >
                            <option value="Win">Win</option>
                            <option value="Nhặt 9">Nhặt 9</option>
                            <option value="Nhặt 8">Nhặt 8</option>
                            <option value="Cộng 9">Cộng 9</option>
                            <option value="Rùa 9">Rùa 9</option>
                            <option value="Bắt đui">Bắt đui</option>
                            <option value="Chấm">Chấm</option>
                            <option value="Khác">Khác...</option>
                        </select>
                        {reason === "Khác" && (
                            <input
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Nhập mô tả khác"
                                className="w-full border rounded px-2 py-1 mb-2"
                            />
                        )}
                        <div className="flex justify-end gap-2">
                            <button onClick={closeAll} className="px-3 py-1 rounded bg-gray-300">
                                Hủy
                            </button>
                            <button onClick={confirmPoint} className="px-3 py-1 rounded bg-green-500 text-white">
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {showHistory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b px-4 py-2">
                            <h2 className="text-lg font-bold">History</h2>
                            <button onClick={closeAll} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                        <div className="p-4">
                            <table className="w-full border text-sm text-center">
                                <thead className="bg-gray-600 text-white">
                                    <tr>
                                        <th className="border px-2 py-1">Rack</th>
                                        <th className="border px-2 py-1">Winner</th>
                                        <th className="border px-2 py-1">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((h) => (
                                        <tr key={h.rack}>
                                            <td className="border px-2 py-1">{h.rack}</td>
                                            <td className="border px-2 py-1">{h.winner}</td>
                                            <td className="border px-2 py-1">{h.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
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
    match: state.matches.match,
    isLoading: state.matches.isLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
    getMatchById: (workspaceId: string, id: number) =>
        dispatch(matchActions.getMatchesById(workspaceId, id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WithLoading(ScoreCounterPage));
