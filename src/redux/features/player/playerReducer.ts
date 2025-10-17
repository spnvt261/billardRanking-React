import type { Player, PlayerSelect } from '../../../types/player';
import { GET_LIST_PLAYERS_SELECT_FAIL, GET_LIST_PLAYERS_SELECT_REQUEST, GET_LIST_PLAYERS_SELECT_SUCCESS, UPLOAD_IMAGE_REQUEST } from '../common';
import * as types from './playerTypes';

interface PlayerAction {
    type: string;
    payload?: any;
}
interface PlayerState {
    isLoading: boolean;
    playersByPage: Record<number, Player[]>;
    error: Error | null;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    listPlayerSelect: PlayerSelect[]
}

const initState: PlayerState = {
    isLoading: false,
    playersByPage: {},
    error: null,
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    last: false,
    listPlayerSelect: [],
};


const playerReducer = (state = initState, action: PlayerAction) => {

    switch (action.type) {
        //Request
        case GET_LIST_PLAYERS_SELECT_REQUEST:
        case UPLOAD_IMAGE_REQUEST:
        case types.GET_PLAYERS_REQUEST:
        case types.CREATE_PLAYER_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        //success
        case types.GET_PLAYERS_SUCCESS:
            // console.log('get');

            return {
                ...state,
                isLoading: false,
                playersByPage: {
                    ...state.playersByPage,
                    [action.payload.page]: action.payload.content, // ✅ cache page
                },
                page: action.payload.page,
                size: action.payload.size,
                totalElements: action.payload.totalElements,
                totalPages: action.payload.totalPages,
                last: action.payload.last,
            };

        case types.CREATE_PLAYER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                playersByPage: {},
                listPlayerSelect: [],
                totalPages: 0
            }

        case GET_LIST_PLAYERS_SELECT_SUCCESS:
            return {
                ...initState,
                isLoading: false,
                listPlayerSelect: action.payload
            }


        //fail
        case GET_LIST_PLAYERS_SELECT_FAIL:
        case types.GET_PLAYERS_FAIL:
        case types.CREATE_PLAYER_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }


        default:
            return state;
    }
}

export default playerReducer;