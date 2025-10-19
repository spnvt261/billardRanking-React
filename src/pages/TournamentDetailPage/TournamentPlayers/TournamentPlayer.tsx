import { useOutletContext } from "react-router-dom";
import type { Tournament } from "../../../types/tournament";
import PlayerCard from "../../../components/layout/tournamentDetail/tournamentPlayers/playerCard";

type ContextType = {
    tournament: Tournament;
};

const TournamentPlayers = () => {
    const { tournament } = useOutletContext<ContextType>();

    if (!tournament || !tournament.listPlayer.length) {
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
                {tournament.listPlayer.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                ))}
            </div>
        </div>
    );
};

export default TournamentPlayers;
