import type { MatchScoreEvent } from "../../../types/matchScoreEvents";
import * as types from "./matchScoreEventTypes";

interface MatchScoreEventAction {
    type: string;
    payload?: any;
}
interface State {
    isCreateLoading: boolean;
    isGetDataLoading: boolean;
    isFetched: boolean;
    isUpdateDataLoading: boolean;
    listDataByPage: Record<number, MatchScoreEvent[]>;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

const initState: State = {
    isCreateLoading: false,
    isGetDataLoading: false,
    isUpdateDataLoading: false,
    isFetched: false,
    listDataByPage: {},
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    last: false,
};

const matchScoreEventReducer = (state = initState, action: MatchScoreEventAction) => {
    switch (action.type) {
        //Request
        case types.GET_ALL_MATCH_SCORE_EVENTS_REQUEST:
            return {
                ...state,
                isGetDataLoading: true,
            }
        case types.CREATE_MATCH_SCORE_EVENT_REQUEST: {
            return {
                ...state,
                isCreateLoading: true,
            }
        }
        //success
        case types.CREATE_MATCH_SCORE_EVENT_SUCCESS:
            return {
                ...state,
                isCreateLoading: false,

            };

        case types.GET_ALL_MATCH_SCORE_EVENTS_SUCCESS:
            return {
                ...state,
                isGetDataLoading: false,
                listDataByPage: {
                    ...state.listDataByPage,
                    [action.payload.page]: action.payload.content,
                },
                page: action.payload.page,
                size: action.payload.size,
                totalElements: action.payload.totalElements,
                totalPages: action.payload.totalPages,
                last: action.payload.last,
            }

        //fail
        case types.CREATE_MATCH_SCORE_EVENT_FAIL:
        case types.GET_ALL_MATCH_SCORE_EVENTS_FAIL:
            return {
                ...state,
                isGetDataLoading: false,
                isCreateLoading: false,
                error: action.payload
            }
        default:
            return state;
    }
}

export default matchScoreEventReducer;