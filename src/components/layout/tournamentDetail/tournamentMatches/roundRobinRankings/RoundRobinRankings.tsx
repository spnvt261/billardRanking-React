import { useEffect } from "react";
import type { RoundRobinRankingsResponse } from "../../../../../types/round";
import { connect } from "react-redux";
import tournamentDetailActions from "../../../../../redux/features/tournamentDetails/tournamentDetailAction";

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
}

const RoundRobinRankings = ({
    roundNumber,
    tournamentId,
    workspaceId,
    getRoundRobinRankings,
    roundRobinRankingsByRound,
}: Props) => {
    const roundRobinRankings = roundRobinRankingsByRound[roundNumber];
    
    useEffect(() => {
        if (workspaceId) {
            getRoundRobinRankings(tournamentId, roundNumber, workspaceId);
        }
    }, [roundNumber]);

    if (!roundRobinRankings) {
        return (
            <div className="text-center text-gray-400 py-6">
                Loading round {roundNumber} rankings...
            </div>
        );
    }

    const getTeamNames = (players?: { name: string }[]) => {
        if (!players || players.length === 0) return "TBA";
        return players.map(p => p.name).join(" & ");
    };

    const { rankings } = roundRobinRankings;
    const groupLabels = ["A", "B", "C", "D", "E", "F","G","H","I"]; 
    return (
        <div className="flex flex-wrap gap-4 bg-gray-500 p-4 overflow-x-auto">
            {Object.entries(rankings).map(([groupKey, teams],index) => {
                const groupLabel = groupLabels[index] || groupKey; 
                return (
                <div
                    key={groupKey}
                    className="bg-gray-800/40 rounded-[.5rem] shadow-lg border border-gray-700"
                >
                    <h2 className=" font-semibold text-slate-300 p-2">
                        BẢNG {groupLabel}
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-200 border-collapse">
                            <thead>
                                <tr className="bg-gray-800 text-gray-300 uppercase text-xs">
                                    <th className="py-3 px-2 text-center">Rank</th>
                                    <th className="py-3 px-2 text-center">Participant</th>
                                    <th className="py-3 px-2 text-center">Match W-L-T</th>
                                    <th className="py-3 px-2 text-center">Pts</th>
                                    <th className="py-3 px-2 text-center">Played</th>
                                    <th className="py-3 px-2 text-center">Match History</th>
                                </tr>
                            </thead>

                            <tbody>
                                {teams
                                    // .sort((a, b) => b.wins - a.wins)
                                    .map((team, index) =>{
                                        return(
                                        <tr
                                            key={team.team.id}
                                            className={`transition ${index % 2 === 0
                                                    ? "bg-gray-600/30"
                                                    : "bg-gray-900/20"
                                                } `}
                                        >
                                            <td className="py-2 px-2 text-center">{index + 1}</td>
                                            <td className="py-2 px-2 text-center font-medium">
                                                {getTeamNames(team.team.players)}
                                            </td>
                                            <td className="py-2 px-2 text-center">
                                                {team.wins} - {team.losses} - {team.ties}
                                            </td>
                                            <td className="py-2 px-2 text-center">
                                                {team.wins}
                                            </td>
                                            <td className="py-2 px-2 text-center">
                                                {team.matchesPlayed} / {team.matchesTotal}
                                            </td>
                                            <td className="py-2 px-2 text-center">
                                                <div className="flex justify-center gap-1">
                                                    {team.recentResults.length > 0 ? (
                                                        team.recentResults.map((r, i) => (
                                                            <div
                                                                key={i}
                                                                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${r === "W"
                                                                        ? "bg-green-500/70 text-white"
                                                                        : "bg-red-500/70 text-white"
                                                                    }`}
                                                            >
                                                                {r}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500">–</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )})}
                            </tbody>
                        </table>
                    </div>
                </div>
            )})}
        </div>
    );
};

// Redux connections
const mapStateToProps = (state: any) => ({
    roundRobinRankingsByRound:
        state.tournamentDetail.roundRobinRankingsByRound,
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoundRobinRankings);
