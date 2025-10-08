
import TournamentList from "../../components/layout/tournaments/tournamentList/TournamentList";
import { tournaments } from "../../data/tournamentData";

const TournamentPage: React.FC = () => {
    console.log('TournamentPages');
    
    return (
        <div className="tournament-page">
            <TournamentList label="Tournaments" list={tournaments}/>
        </div>
    )
}

export default TournamentPage