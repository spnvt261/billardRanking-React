import { connect } from "react-redux";
import tournamentDetailActions from "../../../../../redux/features/tournamentDetails/tournamentDetailAction";
import type { RoundRobinRankingsResponse } from "../../../../../types/round";
import { useEffect, useMemo, useState } from "react";
import CustomButton from "../../../../customButtons/CustomButton";

interface Props {
    roundNumber: 1 | 2 | 3;
    tournamentId: string;
    workspaceId: string | null;
    roundRobinRankingsByRound: { [key: number]: RoundRobinRankingsResponse };
    getRoundRobinRankings: (
        tournamentId: string,
        roundNumber: 1 | 2 | 3,
        workspaceId: string
    ) => Promise<void>;
    handleEndRound: (listIds:number[]) => void;
    roundPlayersAfter?: number;
}

const EndRoundForm = ({
    roundNumber,
    tournamentId,
    workspaceId,
    getRoundRobinRankings,
    roundRobinRankingsByRound,
    handleEndRound,
    roundPlayersAfter,
}: Props) => {
    const roundRobinRankings = roundRobinRankingsByRound[roundNumber];

    // --- GỌI API ---
    useEffect(() => {
        if (!workspaceId) return;
        getRoundRobinRankings(tournamentId, roundNumber, workspaceId);
    }, []);


    // --- Helper ---
    const getTeamNames = (players?: { name: string }[]) => {
        if (!players || players.length === 0) return "TBA";
        return players.map((p) => p.name).join(" & ");
    };

    // --- Chuẩn bị dữ liệu ---
    const { rankings } = roundRobinRankings || { rankings: {} };
    const allTeams = useMemo(() => {
        return Object.values(rankings).flat() || [];
    }, [rankings]);
    const totalPlayers = allTeams.length;

    // --- Lưu danh sách team ID vượt qua ---
    const [passedIds, setPassedIds] = useState<number[]>([]);

    // Cập nhật khi dữ liệu hoặc roundPlayersAfter thay đổi
    useEffect(() => {
        if (roundPlayersAfter && allTeams.length > 0) {
            const defaultIds = allTeams
                .slice(0, roundPlayersAfter)
                .map((t) => t.team.id);
            setPassedIds(defaultIds);
        }
    }, [roundPlayersAfter, allTeams]);

    // --- Nếu chưa có data ---
    if (!roundRobinRankings) {
        return (
            <div className="text-center text-gray-400 py-6">
                Loading round {roundNumber} rankings...
            </div>
        );
    }

    if (!roundPlayersAfter) {
        return (
            <div className="text-gray-400 text-center py-6">
                Không có dữ liệu số người vượt qua vòng này.
            </div>
        );
    }

    // --- Tách danh sách ---
    const passedPlayers = allTeams.filter((p) =>
        passedIds.includes(p.team.id)
    );
    const eliminatedPlayers = allTeams.filter(
        (p) => !passedIds.includes(p.team.id)
    );

    // --- Toggle team ---
    const togglePlayer = (teamId: number) => {
        const isPassed = passedIds.includes(teamId);

        if (isPassed) {
            setPassedIds((prev) => prev.filter((id) => id !== teamId));
        } else {
            if (passedIds.length < roundPlayersAfter) {
                setPassedIds((prev) => [...prev, teamId]);
            } else {
                alert(`Số lượng tối đa người vượt qua là ${roundPlayersAfter}.`);
            }
        }
    };

    const canEndRound = passedIds.length === roundPlayersAfter;
    
    return (
        <div className="bg-gray-700/40 p-4 border border-gray-600 text-gray-200">
            <h2 className="text-lg font-semibold mb-4">
                Kết thúc vòng {roundNumber}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- Danh sách vượt qua --- */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-green-400 font-semibold mb-3">
                        ✅ Người vượt qua ({passedIds.length}/{roundPlayersAfter})
                    </h3>
                    <ul className="space-y-2">
                        {passedPlayers.map((team, index) => (
                            <li
                                key={team.team.id}
                                className="flex justify-between items-center bg-gray-600/30 px-3 py-2 rounded-lg"
                            >
                                <span>
                                    #{index + 1} –{" "}
                                    {getTeamNames(team.team.players)}
                                </span>
                                <button
                                    onClick={() => togglePlayer(team.team.id)}
                                    className="text-red-400 font-bold hover:text-red-500"
                                    title="Loại người này khỏi danh sách vượt qua"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --- Danh sách bị loại --- */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-red-400 font-semibold mb-3">
                        ❌ Người bị loại ({eliminatedPlayers.length}/
                        {totalPlayers - roundPlayersAfter})
                    </h3>
                    <ul className="space-y-2">
                        {eliminatedPlayers.map((team, index) => (
                            <li
                                key={team.team.id}
                                className="flex justify-between items-center bg-gray-600/30 px-3 py-2 rounded-lg"
                            >
                                <span>
                                    #{roundPlayersAfter + index + 1} –{" "}
                                    {getTeamNames(team.team.players)}
                                </span>
                                <button
                                    onClick={() => togglePlayer(team.team.id)}
                                    disabled={passedIds.length >= roundPlayersAfter}
                                    className={`font-bold ${passedIds.length >= roundPlayersAfter
                                        ? "text-gray-500 cursor-not-allowed"
                                        : "text-green-400 hover:text-green-500"
                                        }`}
                                    title="Thêm người này vào danh sách vượt qua"
                                >
                                    ＋
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center">
                <CustomButton
                    label={`End ROUND${roundNumber}`}
                    variant="type-4"
                    disabled={!canEndRound}
                    onClick={()=>handleEndRound(passedIds)}
                />
            </div>
        </div>
    );
};

// Redux connections
const mapStateToProps = (state: any) => ({
    roundRobinRankingsByRound: state.tournamentDetail.roundRobinRankingsByRound,
});

const mapDispatchToProps = (dispatch: any) => ({
    getRoundRobinRankings: (
        tournamentId: string,
        roundNumber: 1 | 2 | 3,
        workspaceId: string
    ) =>
        dispatch(
            tournamentDetailActions.getRoundRobinRankings(
                tournamentId,
                roundNumber,
                workspaceId
            )
        ),
});

export default connect(mapStateToProps, mapDispatchToProps)(EndRoundForm);
