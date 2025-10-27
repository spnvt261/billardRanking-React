import type { Match } from "../../../types/match";
import { END_MATCH_SUCCESS, PAUSE_MATCH_SUCCESS } from "../matchScoreEvent/matchScoreEventTypes";
import { OTHER_TYPE_SUCCESS, ROUND_ROBIN_SUCCESS, UPDATE_MATCH_SUCCESS } from "../tournamentDetails/tournamentDetailTypes";
import * as types from "./matchTypes";

interface MatchAction {
    type: string;
    payload?: any;
}
interface MatchState {
    isUpdateMatchLoading: boolean;
    isLoading: boolean;
    isGetMatchLoading: boolean;
    matchesByPage: Record<number, Match[]>;
    error: Error | null;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    match:Match | null
}

const initState: MatchState = {
    isLoading: false,
    isGetMatchLoading:false,
    isUpdateMatchLoading:false,
    matchesByPage: {},
    error: null,
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    last: false,
    match: null
};

const matchReducer = (state=initState, action:MatchAction) =>{
    switch (action.type) {
            //Request

            case types.GET_MATCH_REQUEST:
                return{
                    ...state,
                    isGetMatchLoading:true
                }
            case types.GET_MATCHES_REQUEST:
            case types.CREATE_MATCH_REQUEST:
                return {
                    ...state,
                    isLoading: true
                }
            //success
            case types.GET_MATCHES_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    matchesByPage: {
                        ...state.matchesByPage,
                        [action.payload.page]: action.payload.content, 
                    },
                    page: action.payload.page,
                    size: action.payload.size,
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    last: action.payload.last,
                };
            case OTHER_TYPE_SUCCESS:
            case ROUND_ROBIN_SUCCESS:
            case END_MATCH_SUCCESS:
            case PAUSE_MATCH_SUCCESS:
            case UPDATE_MATCH_SUCCESS:
                return{
                    ...state,
                    matchesByPage:{}
                }
            case types.CREATE_MATCH_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    matchesByPage: {},
                    totalPages:0
                }
            case types.GET_MATCH_SUCCESS:
                return{
                    ...state,
                    isGetMatchLoading: false,
                    // match:action.payload
                }
            //fail
            case types.GET_MATCH_FAIL:
            case types.GET_MATCHES_FAIL:
            case types.CREATE_MATCH_FAIL:
                return {
                    ...state,
                    isLoading: false,
                    error: action.payload,
                    isGetMatchLoading:false,
                    isUpdateMatchLoading:false
                }
    
        
            default:
                return state;
        }
}

export default matchReducer;