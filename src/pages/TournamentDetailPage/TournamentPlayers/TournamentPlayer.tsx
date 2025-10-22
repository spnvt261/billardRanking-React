import { useOutletContext } from "react-router-dom";
import type { TournamentDetail } from "../../../types/tournament";
import PlayerCard from "../../../components/layout/tournamentDetail/tournamentPlayers/playerCard";

type ContextType = {
    tournament: TournamentDetail;
};

const TournamentPlayers = () => {
    const { tournament } = useOutletContext<ContextType>();
    // console.log(tournament);
    
    if (!tournament || !tournament.listTeamByRound[1].length) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-semibold mb-4">Cơ thủ tham dự</h1>
                <p className="text-gray-500">No players available.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6 text-slate-600">Cơ thủ tham dự</h1>

            <div className="flex flex-wrap gap-6">
                {tournament.listTeamByRound[1].map((team) => (
                    <PlayerCard key={team.players[0].id} player={team.players[0]} />
                ))}
            </div>
        </div>
    );
};

export default TournamentPlayers;
