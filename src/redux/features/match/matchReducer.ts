import type { Match } from "../../../types/match";
import * as types from "./matchTypes";

interface MatchAction {
    type: string;
    payload?: any;
}
interface MatchState {
    isLoading: boolean;
    matchesByPage: Record<number, Match[]>;
    error: Error | null;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

const initState: MatchState = {
    isLoading: false,
    matchesByPage: {},
    error: null,
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    last: false,
};

const matchReducer = (state=initState, action:MatchAction) =>{
    switch (action.type) {
            //Request
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
    
            case types.CREATE_MATCH_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    matchesByPage: {},
                    totalPages:0
                }

            //fail
            case types.GET_MATCHES_FAIL:
            case types.CREATE_MATCH_FAIL:
                return {
                    ...state,
                    isLoading: false,
                    error: action.payload
                }
    
        
            default:
                return state;
        }
}

export default matchReducer;