import { connect } from "react-redux";
import AddSpecialTournamentForm from "../../components/forms/addSpecialTournamentForm/AddSpecialTournamentForm";
import AddTournamentForm from "../../components/forms/addTournamentForm/AddTournamentForm";
import FormToggle from "../../components/forms/FormToggle";
import TournamentList from "../../components/layout/tournaments/tournamentList/TournamentList";
import { tournaments } from "../../data/tournamentData";
import tournamentActions from "../../redux/features/tournament/tournamentActions";
import type { Tournament } from "../../types/tournament";

interface props {
    getAllTournaments: (workspaceId: string, page: number) => Promise<void>;
    isLoading: boolean;
    totalElements: number;
    totalPages: number;
    page: number;
    listTournaments: Tournament[]
}
const TournamentPage: React.FC<props> = () => {
    const specialTournaments = tournaments.filter(t => t.tournament_type === 'Đền');
    const normalTournaments = tournaments.filter(t => t.tournament_type !== 'Đền');
    return (
        <div className="tournament-page">
            <div className="flex">
                <FormToggle
                    btnLabel="Tạo giải đấu"
                    formTitle="Tạo giải đấu mới"
                    className="mr-3 mb-4"
                    element={AddTournamentForm}
                    needPermission
                />
                <FormToggle
                    btnLabel="Tạo mâm đền"
                    formTitle="Tạo mâm đền"
                    btnVariant="type-1"
                    element={AddSpecialTournamentForm}
                    className="mb-4"
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

const mapStateToProps = (state: any) => ({
    isLoading: state.tournaments.isLoading,
    listTournaments: state.tournaments.tournaments,
    totalElements: state.tournaments.totalElements,
    totalPages: state.tournaments.totalPages,
    page: state.tournaments.page,
});

const mapDispatchToProps = (dispatch: any) => ({
    getAllTournaments: (workspaceId: string, page: number) => dispatch(tournamentActions.getAllTournaments(workspaceId, page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TournamentPage) 