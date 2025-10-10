
import AddTournamentForm from "../../components/forms/addTournamentForm/AddTournamentForm";
import FormToggle from "../../components/forms/FormToggle";
import TournamentList from "../../components/layout/tournaments/tournamentList/TournamentList";
import { tournaments } from "../../data/tournamentData";

const TournamentPage: React.FC = () => {
    console.log('TournamentPages');
    const specialTournaments = tournaments.filter(t => t.tournament_type === 'Đền');
    const normalTournaments = tournaments.filter(t => t.tournament_type !== 'Đền');
    return (
        <div className="tournament-page">
            <FormToggle
                btnLabel="Tạo giải đấu"
                formTitle="Tạo giải đấu mới"
                element={AddTournamentForm}
            />
            <TournamentList
                label="Tournaments"
                list={normalTournaments}
            />
            <TournamentList
                label="đền"
                list={specialTournaments}
            />
        </div>
    )
}

export default TournamentPage