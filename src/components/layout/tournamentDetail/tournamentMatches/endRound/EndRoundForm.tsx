import { connect } from "react-redux";
import tournamentDetailActions from "../../../../../redux/features/tournamentDetails/tournamentDetailAction";
import type { RoundRobinRankingsResponse } from "../../../../../types/round";
import { useEffect, useMemo, useState } from "react";
import CustomButton from "../../../../customButtons/CustomButton";
import { TournamentStatus, TournamentType, type TournamentDetail, type TournamentsRequest } from "../../../../../types/tournament";
import { FaMedal } from "react-icons/fa6";
import { formatDateVN } from "../../../../../ultils/format";
import tournamentActions from "../../../../../redux/features/tournament/tournamentActions";
import { useNotification } from "../../../../../customhook/useNotifycation";

interface Props {
    roundNumber: 1 | 2 | 3;
    tournament: TournamentDetail;
    roundType: TournamentType | ""
    workspaceId: string | null;
    roundRobinRankingsByRound: { [key: number]: RoundRobinRankingsResponse };
    getRoundRobinRankings: (
        tournamentId: string,
        roundNumber: 1 | 2 | 3,
        workspaceId: string
    ) => Promise<void>;
    handleEndRound: (listIds: number[]) => Promise<void>;
    roundPlayersAfter?: number;
    updateTournament: (tournamentId: string, data: TournamentsRequest, workspaceId: string) => Promise<void>
}

const EndRoundForm = ({
    roundNumber,
    tournament,
    workspaceId,
    getRoundRobinRankings,
    roundRobinRankingsByRound,
    handleEndRound,
    roundPlayersAfter,
    roundType,
    updateTournament
}: Props) => {
    const roundRobinRankings = roundRobinRankingsByRound[roundNumber];
    const { rankings } = roundRobinRankings || { rankings: {} };
    const { notify } = useNotification();

    // --- Lưu danh sách team ID vượt qua ---
    const [passedIds, setPassedIds] = useState<number[]>([]);
    // --- GỌI API ---
    useEffect(() => {
        if (!workspaceId) return;
        getRoundRobinRankings(tournament.id.toString(), roundNumber, workspaceId);
    }, []);


    // --- Helper ---
    const getTeamNames = (players?: { name: string }[]) => {
        if (!players || players.length === 0) return "TBA";
        return players.map((p) => p.name).join(" & ");
    };
    // console.log(roundRobinRankings);
    const isLastRound =
        (roundNumber === 1 && !tournament.tournamentType2) ||
        (roundNumber === 2 && !tournament.tournamentType3) ||
        roundNumber === 3;

    const allTeams = useMemo(() => {
        if (!roundPlayersAfter || !roundRobinRankings) return [];

        // --- Nếu là ROUND_ROBIN ---
        if (roundType === TournamentType.ROUND_ROBIN) {
            const tables = Object.values(rankings);
            if (tables.length === 0) return [];

            // Nếu chưa phải vòng cuối: dùng logic cũ
            if (!isLastRound) {
                const result: typeof tables[0][0][] = [];
                let i = 0;
                while (result.length < roundPlayersAfter) {
                    let added = false;
                    for (const table of tables) {
                        if (i < table.length) {
                            result.push(table[i]);
                            added = true;
                            if (result.length === roundPlayersAfter) break;
                        }
                    }
                    if (!added) break;
                    i++;
                }
                return result;
            }

            // Nếu là vòng cuối: gom tất cả bảng xếp hạng thành mảng 1 chiều
            const flattened = tables.flat();
            return flattened;
        }

        // --- Nếu là thể thức khác (SINGLE_ELIMINATION, DOUBLE_ELIMINATION, v.v.) ---
        const otherTypeTeamsMap = roundRobinRankings.otherTypesTeams || {};
        const groups = otherTypeTeamsMap[roundType as keyof typeof otherTypeTeamsMap];

        if (!groups || groups.length === 0) return [];

        const flattenedTeams = groups.flat();
        return flattenedTeams;
    }, [rankings, roundPlayersAfter, roundRobinRankings, roundType, isLastRound]);


    const allTeamsFlat = useMemo(() => {
        return Object.values(rankings).flat();
    }, [rankings]);



    // --- Tách danh sách ---
    const passedPlayers = allTeamsFlat.filter((p) =>
        passedIds.includes(p.team.id)
    );

    const eliminatedPlayers = allTeamsFlat.filter(
        (p) => !passedIds.includes(p.team.id)
    );


    const totalPlayers = Object.values(rankings).flat().length;

    // Cập nhật khi dữ liệu hoặc roundPlayersAfter thay đổi
    useEffect(() => {
        if (roundPlayersAfter && allTeams.length > 0 && passedIds.length === 0 && roundType === TournamentType.ROUND_ROBIN) {
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

    const handleEndTournament = async () => {

        const tournamentRequest: TournamentsRequest = {
            ...tournament,
            winnerId: allTeams?.[0]?.players?.[0]?.id || allTeams?.[0]?.team?.players?.[0]?.id,
            runnerUpId: allTeams?.[1]?.players?.[0]?.id || allTeams?.[1]?.team?.players?.[0]?.id,
            thirdPlaceId: allTeams?.[2]?.players?.[0]?.id || allTeams?.[2]?.team?.players?.[0]?.id,
            endDate: formatDateVN(new Date()),
            status: TournamentStatus.FINISHED,
        }
        console.log(tournamentRequest);

        try {
            handleEndRound(passedIds).then(() => {
                if (workspaceId) updateTournament(tournament.id.toString(), tournamentRequest, workspaceId)
            }
            )

            notify('Giải đấu đã kết thúc!', 'success')
        } catch (err) {
            console.log(err);
            notify(`Lỗi khi kết thúc giải đấu! ${err}`, 'error')
        }
    }
    const canEndRound = passedIds.length === roundPlayersAfter;
    const canEndTournament: boolean =
        tournament.round1Status === TournamentStatus.FINISHED &&
        (!tournament.tournamentType2 || tournament.round2Status === TournamentStatus.FINISHED) &&
        (!tournament.tournamentType3 || tournament.round3Status === TournamentStatus.FINISHED) ||
        isLastRound;
    return (
        <div className="bg-gray-700/40 p-4 border border-gray-600 text-gray-200">
            {roundPlayersAfter > 1 && roundType === TournamentType.ROUND_ROBIN ?
                <div>
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
                            onClick={() => handleEndRound(passedIds)}
                        />
                    </div>
                </div>
                :
                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        Kết thúc vòng {roundNumber}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* --- Danh sách vượt qua --- */}
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <h3 className="text-green-400 font-semibold mb-3">
                                BẢNG XẾP HẠNG
                            </h3>
                            <ul className="space-y-2">
                                {allTeams.length > 0 &&
                                    allTeams.map((team, index) => {
                                        const players = roundType !== TournamentType.ROUND_ROBIN ? team?.players : team.team.players;
                                        const teamName = players.length > 0 ? getTeamNames(players) : "Đội chưa xác định";

                                        // --- Xác định thứ hạng & màu/icon ---
                                        let rankIcon = null;
                                        let rankColor = "text-gray-300";

                                        switch (index + 1) {
                                            case 1:
                                                rankIcon = <FaMedal className="text-yellow-400 inline-block mr-2" />;
                                                rankColor = "text-yellow-400 font-semibold";
                                                break;
                                            case 2:
                                                rankIcon = <FaMedal className="text-gray-300 inline-block mr-2" />;
                                                rankColor = "text-gray-300 font-semibold";
                                                break;
                                            case 3:
                                                rankIcon = <FaMedal className="text-amber-700 inline-block mr-2" />;
                                                rankColor = "text-amber-700 font-semibold";
                                                break;
                                            case 4:
                                                rankIcon = <FaMedal className="text-amber-700 inline-block mr-2" />;
                                                rankColor = "text-amber-700 font-semibold";
                                                break;
                                            default:
                                                rankIcon = (
                                                    <span className="inline-block w-5 text-center font-semibold text-gray-400">
                                                        #{index + 1}
                                                    </span>
                                                );
                                        }

                                        return (
                                            <li
                                                key={team?.team?.id || index}
                                                className="flex justify-between items-center bg-gray-600/30 px-3 py-2 rounded-lg hover:bg-gray-600/50 transition-colors"
                                            >
                                                <span className={`flex items-center ${rankColor}`}>
                                                    {rankIcon}
                                                    {teamName}
                                                </span>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-center">
                        {
                            canEndTournament ?
                                <CustomButton
                                    label="Kết thúc giải đấu"
                                    variant="type-4"
                                    disabled={!canEndTournament}
                                    onClick={handleEndTournament}
                                /> :

                                <CustomButton
                                    label={`End ROUND${roundNumber}`}
                                    variant="type-4"
                                    onClick={() => handleEndRound(passedIds)}
                                />

                        }
                    </div>

                </div>
            }


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
    updateTournament: (tournamentId: string, data: TournamentsRequest, workspaceId: string) => dispatch(tournamentActions.updateTournament(tournamentId, data, workspaceId))
});

export default connect(mapStateToProps, mapDispatchToProps)(EndRoundForm);
