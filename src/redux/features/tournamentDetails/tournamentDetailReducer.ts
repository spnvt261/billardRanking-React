import type { Match } from '../../../types/match';
import type { RoundRobinRankingsResponse } from '../../../types/round';
import type { TournamentDetail } from '../../../types/tournament';
import { CLEAN_TOURNAMENT_DETAIL, UPDATE_TOURNAMENT_ROUND_STATUS_FAIL, UPDATE_TOURNAMENT_ROUND_STATUS_REQUEST, UPDATE_TOURNAMENT_ROUND_STATUS_SUCCESS } from '../tournament/tournamentTypes';
import * as types from './tournamentDetailTypes';

interface TournamentDetailAction {
    type: string;
    payload?: any;
    roundNumber?: 1 | 2 | 3;
}

interface State {
    isCreateRoundMatchLoading: boolean;
    matchesByRound: Record<number, Match[]>;
    isLoadingByRound: Record<number, boolean>;
    tournamentDetail: TournamentDetail | null;
    isGetDataLoading: boolean;
    isUpdateMatchLoading:boolean
    isUpdateTournamentLoading:boolean;
    roundRobinRankingsByRound: Record<number, RoundRobinRankingsResponse|null>;
}

const initState: State = {
    isGetDataLoading: false,
    isCreateRoundMatchLoading: false,
    isUpdateMatchLoading:false,
    isUpdateTournamentLoading:false,
    matchesByRound: {
        1: [],
        2: [],
        3: [],
    },
    isLoadingByRound: {
        1: false,
        2: false,
        3: false,
    },
    roundRobinRankingsByRound:{
        1:null,
        2:null,
        3:null,
    },
    tournamentDetail: null
};

const tournamentDetailReducer = (state = initState, action: TournamentDetailAction): State => {
    switch (action.type) {
        //GET ROUNDROBIN RANKINGS:
        //UPDATE ROUND STATUS
        case types.ROUND_ROBIN_RANKINGS_REQUEST: {
            const round = action.roundNumber!;
            return{
                ...state,
                isLoadingByRound: { ...state.isLoadingByRound, [round]: true },
            }
        }
        case types.ROUND_ROBIN_RANKINGS_SUCCESS:{
            const round = action.roundNumber!;
            return{
                ...state,
                isLoadingByRound: { ...state.isLoadingByRound, [round]: false },
                roundRobinRankingsByRound:{ ...state.roundRobinRankingsByRound, [round]: action.payload },
            }
        }
        case types.ROUND_ROBIN_RANKINGS_FAIL:{
            const round = action.roundNumber!;
            return{
                ...state,
                isLoadingByRound: { ...state.isLoadingByRound, [round]: false },
            }
        }
        case UPDATE_TOURNAMENT_ROUND_STATUS_REQUEST:
            return{
                ...state,
                isUpdateTournamentLoading:true,
            }
        case UPDATE_TOURNAMENT_ROUND_STATUS_SUCCESS:
            return{
                ...state,
                isUpdateTournamentLoading:false,
                tournamentDetail: null
            }
        case UPDATE_TOURNAMENT_ROUND_STATUS_FAIL:
            return{
                ...state,
                isUpdateTournamentLoading:false,
            }
        //Tournament Detail
        case types.GET_TOURNAMENT_DETAIL_REQUEST:
            return {
                ...state,
                isGetDataLoading: true,
            };
        case types.GET_TOURNAMENT_DETAIL_SUCCESS:
            return {
                ...state,
                isGetDataLoading: false,
                tournamentDetail: action.payload
            };
        case types.GET_TOURNAMENT_DETAIL_FAIL:
            return {
                ...state,
                isGetDataLoading: false,
            };

        // Round Robin
        case types.ROUND_ROBIN_REQUEST:
            return { ...state, isCreateRoundMatchLoading: true };
        case types.ROUND_ROBIN_SUCCESS:
            return {
                ...state,
                isCreateRoundMatchLoading: false,
                tournamentDetail: null
            }
        case types.ROUND_ROBIN_FAIL:
            return { ...state, isCreateRoundMatchLoading: false };

        // Matches by round (dynamic)
        case types.GET_MATCHES_REQUEST: {
            const round = action.roundNumber!;
            return {
                ...state,
                isLoadingByRound: { ...state.isLoadingByRound, [round]: true },
            };
        }
        case types.GET_MATCHES_SUCCESS: {
            const round = action.roundNumber!;
            return {
                ...state,
                isLoadingByRound: { ...state.isLoadingByRound, [round]: false },
                matchesByRound: { ...state.matchesByRound, [round]: action.payload || [] },
            };
        }
        case types.GET_MATCHES_FAIL: {
            const round = action.roundNumber!;
            return {
                ...state,
                isLoadingByRound: { ...state.isLoadingByRound, [round]: false },
            };
        }

        //Update Matches
        case types.UPDATE_MATCH_REQUEST:
            return{
                ...state,
                isUpdateMatchLoading:true,
            }
        case types.UPDATE_MATCH_SUCCESS:
            return{
                ...state,
                isUpdateMatchLoading:false,
                matchesByRound:{}
            }
        case types.UPDATE_MATCH_FAIL:
            return{
                ...state,
                isUpdateMatchLoading:false,
            }

        //clean
        case CLEAN_TOURNAMENT_DETAIL:
            return {
                ...state,
                tournamentDetail: null,
                matchesByRound: {},
                roundRobinRankingsByRound:{}
            }

        default:
            return state;
    }
};

export default tournamentDetailReducer;
