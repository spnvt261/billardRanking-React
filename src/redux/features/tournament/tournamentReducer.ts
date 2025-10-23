import type {TournamentDetail, TournamentsResponse } from "../../../types/tournament";
import { UPLOAD_IMAGE_REQUEST } from "../common";
import * as types from "./tournamentTypes";

interface TournamentAction {
    type: string;
    payload?: any;
}
interface TournamentState {
    isCreateLoading: boolean;
    isGetDataLoading: boolean;
    dataTournaments: TournamentsResponse;
    error: Error | null;
    isFetched: boolean;
    tournamentDetail:TournamentDetail | null;
    isUpdateDataLoading:boolean;
}

const initState: TournamentState = {
    isCreateLoading: false,
    isGetDataLoading: false,
    isUpdateDataLoading:false,
    isFetched: false,
    dataTournaments:{
        NormalTournament:{},
        SpecialDen:[]
    },
    tournamentDetail:null,
    error: null,
};

const tournamentReducer = (state=initState, action:TournamentAction) =>{
    switch (action.type) {
            //Request
            // case types.GET_ONE_TOURNAMENT_REQUEST:
            // case types.UPDATE_TOURNAMENT_REQUEST:{
            //     return{
            //         ...state,
            //         isUpdateDataLoading
            //     }
            // }
            case types.GET_TOURNAMENTS_REQUEST:
                return{
                     ...state,
                    isGetDataLoading: true
                }
            case UPLOAD_IMAGE_REQUEST:
            case types.CREATE_TOURNAMENT_REQUEST:
                return {
                    ...state,
                    isCreateLoading: true
                }
            //success
            case types.GET_TOURNAMENTS_SUCCESS:
                return {
                    ...state,
                    isFetched: true,
                    isGetDataLoading: false,
                    dataTournaments:action.payload,
                };
    
            case types.CREATE_TOURNAMENT_SUCCESS:
                return {
                    ...state,
                    isCreateLoading: false,
                    isFetched: false
                }
            // case types.GET_ONE_TOURNAMENT_SUCCESS:
            //     return{
            //         ...state,
            //         isGetDataLoading: false,
            //         tournamentDetail:action.payload
            //     }

            //fail
            // case types.GET_ONE_TOURNAMENT_FAIL:
            case types.GET_TOURNAMENTS_FAIL:
            case types.CREATE_TOURNAMENT_FAIL:
                return {
                    ...state,
                    isGetDataLoading: false,
                    isCreateLoading:false,
                    error: action.payload
                }
                
            //clean
            // case types.CLEAN_TOURNAMENT_DETAIL:
            //     return{
            //         ...state,
            //         tournamentDetail:null
            //     }
        
            default:
                return state;
        }
}

export default tournamentReducer;