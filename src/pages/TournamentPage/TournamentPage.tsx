
import AddSpecialTournamentForm from "../../components/forms/addSpecialTournamentForm/AddSpecialTournamentForm";
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
            <div className="flex">
                <FormToggle
                    btnLabel="Tạo giải đấu"
                    formTitle="Tạo giải đấu mới"
                    className="mr-3"
                    element={AddTournamentForm}
                    needPermission
                />
                <FormToggle
                    btnLabel="Tạo mâm đền"
                    formTitle="Tạo mâm đền"
                    btnVariant="type-1"
                    element={AddSpecialTournamentForm}
                    needPermission
                />
            </div>
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