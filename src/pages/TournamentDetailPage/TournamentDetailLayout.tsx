import { Outlet, useParams } from "react-router-dom";
import Navbar from "../../components/layout/tournamentDetail/nav/Navbar";
import type { TournamentDetail } from "../../types/tournament";
import { useWorkspace } from "../../customhook/useWorkspace";
import { useEffect } from "react";
import tournamentActions from "../../redux/features/tournament/tournamentActions";
import { connect } from "react-redux";
import WithLoading from "../../components/loading/WithLoading";

interface Props {
    getTournamentById: (id: string, workspaceId: string) => Promise<void>;
    tournament: TournamentDetail | null;
    isLoading:boolean;
    showLoading?:(isLoading:boolean) =>void;
    cleanTournamentDetail:()=>void;
    isUpdateTournamentLoading:boolean
    isGetDataLoading:boolean
}
const TournamentDetailLayout = ({ getTournamentById, tournament,isLoading,showLoading,cleanTournamentDetail,isUpdateTournamentLoading,isGetDataLoading }: Props) => {
    // console.log('TournamentsDetails');
    // console.log(tournament);
    
    const { workspaceId } = useWorkspace()
    const { id } = useParams<{ id: string }>();
    
    useEffect(() => {
        if (id && workspaceId && !tournament) {
            getTournamentById(id, workspaceId)
        }
        return () => {
            cleanTournamentDetail();
        };
    }, [isLoading,isUpdateTournamentLoading])


    useEffect(()=>{
        if(showLoading) {
            
            showLoading(isLoading || isUpdateTournamentLoading || isGetDataLoading)
        } 
    },[isLoading,isUpdateTournamentLoading,isGetDataLoading])
    return (
        <div className="relative flex flex-col sm:flex-row gap-4">
            <Navbar />
            <div className="flex-1 p-2 mt-0 ml-[210px] max-[512px]:ml-0 min-h-[600px] z-1 overflow-hidden">
                <Outlet context={{tournament}}/>
            </div>

        </div>
    )
}
const mapStateToProps = (state: any) => ({
    isLoading: state.tournamentDetail.isCreateRoundMatchLoading,
    isGetDataLoading: state.tournamentDetail.isGetDataLoading,
    isUpdateTournamentLoading: state.tournamentDetail.isUpdateTournamentLoading,
    tournament: state.tournamentDetail.tournamentDetail
});

const mapDispatchToProps = (dispatch: any) => {
    // console.log(dispatch);
    return {
        getTournamentById: (id: string, workspaceId: string) => dispatch(tournamentActions.getTournamentById(id, workspaceId)),
        cleanTournamentDetail: ()=>dispatch(tournamentActions.cleanTournamentDetail())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithLoading(TournamentDetailLayout) ) 