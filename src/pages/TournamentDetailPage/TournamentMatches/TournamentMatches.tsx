import { useOutletContext } from "react-router-dom";
import type { TournamentDetail } from "../../../types/tournament";
import TournamentMatchInRound from "../../../components/layout/tournamentDetail/tournamentMatches/TournamentMatchInRound";

type ContextType = {
    tournament: TournamentDetail;
};

const TournamentMatches = () => {
    const { tournament } = useOutletContext<ContextType>();
    // console.log(tournament);
    if (!tournament || !tournament.listTeam.length) {
        return (<div className="text-slate-500 font-bold">No DATA</div>)
    }
    return (
        <div>
            <TournamentMatchInRound
                title="Round1"
                roundNumber={1}
                tournament={tournament}
            />
            {
                tournament.tournamentType2 &&
                <TournamentMatchInRound
                    title="Round2"
                    roundNumber={2}
                    tournament={tournament}
                />
            }
            {
                tournament.tournamentType2 &&  tournament.tournamentType3 &&
                <TournamentMatchInRound
                    title="Round3"
                    roundNumber={3}
                    tournament={tournament}
                />
            }
        </div>
    )
}

export default TournamentMatches