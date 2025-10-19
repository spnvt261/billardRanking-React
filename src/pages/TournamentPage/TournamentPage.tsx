import { connect } from "react-redux";
import AddSpecialTournamentForm from "../../components/forms/addSpecialTournamentForm/AddSpecialTournamentForm";
import AddTournamentForm from "../../components/forms/addTournamentForm/AddTournamentForm";
import FormToggle from "../../components/forms/FormToggle";
import TournamentList from "../../components/layout/tournaments/tournamentList/TournamentList";
import tournamentActions from "../../redux/features/tournament/tournamentActions";
import type { TournamentsResponse } from "../../types/tournament";
import { useEffect } from "react";
import { useWorkspace } from "../../customhook/useWorkspace";
import WithLoading from "../../components/loading/WithLoading";

interface Props {
    getAllTournaments: (workspaceId: string) => Promise<void>;
    showLoading?: (isLoading: boolean) => void;
    isLoading: boolean;
    isCreateLoading: boolean;
    dataTournaments: TournamentsResponse
    isFetched:boolean;
}
const TournamentPage: React.FC<Props> = ({
    getAllTournaments,
    dataTournaments,
    isLoading,
    isCreateLoading,
    showLoading,
    isFetched
}) => {
    const specialTournaments = dataTournaments.SpecialDen;
    const { workspaceId } = useWorkspace();
    useEffect(() => {
        if (showLoading) {
            showLoading(isLoading)
        }
    }, [isLoading])
    useEffect(() => {
        if (!isFetched && workspaceId) {
            getAllTournaments(workspaceId);
        }
    }, [isFetched, workspaceId, isCreateLoading]);
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
            <h3 className="mb-1 text-xl text-slate-600 font-bold" >TOURNAMENTS</h3>
            {Object.entries(dataTournaments.NormalTournament).map(([quarter, list]) => (
                <TournamentList
                    key={quarter}
                    label={quarter}
                    list={list}
                />
            ))}
            <TournamentList
                label="đền"
                list={specialTournaments}
            />
        </div>
    )
}

const mapStateToProps = (state: any) => ({
    isLoading: state.tournaments.isGetDataLoading,
    isCreateLoading: state.tournaments.isCreateLoading,
    dataTournaments: state.tournaments.dataTournaments,
    isFetched:state.tournaments.isFetched
});

const mapDispatchToProps = (dispatch: any) => ({
    getAllTournaments: (workspaceId: string) => dispatch(tournamentActions.getAllTournaments(workspaceId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WithLoading(TournamentPage)) 