import { useOutletContext } from "react-router-dom";
import type { TournamentDetail } from "../../../types/tournament";
import TournamentMatchInRound from "../../../components/layout/tournamentDetail/tournamentMatches/TournamentMatchInRound";

type ContextType = {
    tournament: TournamentDetail;
};

const TournamentMatches = () => {
    const { tournament } = useOutletContext<ContextType>();
    // console.log(tournament);
    if(!tournament || !tournament.listTeam.length){
        return(<div className="text-slate-500 font-bold">No DATA</div>)
    }
    return (
        <div>
            <TournamentMatchInRound
                title="Round1"
                roundNumber={1}
                tournament={tournament}
            />
        </div>
    )
}

export default TournamentMatches