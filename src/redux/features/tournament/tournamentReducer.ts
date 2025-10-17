import type { Tournament } from "../../../types/tournament";
import * as types from "./tournamentTypes";

interface TournamentAction {
    type: string;
    payload?: any;
}
interface TournamentState {
    isLoading: boolean;
    listTournaments: Tournament[]
    error: Error | null;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

const initState: TournamentState = {
    isLoading: false,
    listTournaments:[],
    error: null,
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    last: false,
};

const tournamentReducer = (state=initState, action:TournamentAction) =>{
    switch (action.type) {
            //Request
            case types.GET_TOURNAMENTS_REQUEST:
            case types.CREATE_TOURNAMENT_REQUEST:
                return {
                    ...state,
                    isLoading: true
                }
            //success
            case types.GET_TOURNAMENTS_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    tournaments:action.payload.content,
                    page: action.payload.page,
                    size: action.payload.size,
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    last: action.payload.last,
                };
    
            case types.CREATE_TOURNAMENT_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    tournaments: [],
                    totalPages:0
                }

            //fail
            case types.GET_TOURNAMENTS_FAIL:
            case types.CREATE_TOURNAMENT_FAIL:
                return {
                    ...state,
                    isLoading: false,
                    error: action.payload
                }
    
        
            default:
                return state;
        }
}

export default tournamentReducer;