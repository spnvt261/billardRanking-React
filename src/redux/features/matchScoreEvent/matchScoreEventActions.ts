import type { Dispatch } from "redux";
import * as types from "./matchScoreEventTypes";
import axios from "axios";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../../../constants/localStorage";
import type { } from "../../../types/tournament";
import type { AllMatchScoreEventsResponse, MatchScoreEvent, MatchScoreEventRequest } from "../../../types/matchScoreEvents";

const getAllMatchScoreEvents = (workspaceId: string, matchId: string, page: number) => async (dispatch: Dispatch): Promise<AllMatchScoreEventsResponse> => {
    dispatch({
        type: types.GET_ALL_MATCH_SCORE_EVENTS_REQUEST,
        payload: null,
    });

    try {
        const response = await axios.get<AllMatchScoreEventsResponse>("/api/match-score-events", {
            params: {
                workspaceId,
                matchId,
                page
            },
        });
        // console.log(response.data);

        dispatch({
            type: types.GET_ALL_MATCH_SCORE_EVENTS_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_ALL_MATCH_SCORE_EVENTS_FAIL,
            payload: error,
        });
        throw error;
    }
};


const createMatchScoreEvent = (data: MatchScoreEventRequest) => async (dispatch: Dispatch): Promise<MatchScoreEvent> => {
    dispatch({
        type: types.CREATE_MATCH_SCORE_EVENT_REQUEST,
    });

    try {
        let token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        if (token && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
        }

        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.post('/api/tournaments', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        dispatch({
            type: types.CREATE_MATCH_SCORE_EVENT_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (err: any) {
        dispatch({
            type: types.CREATE_MATCH_SCORE_EVENT_FAIL,
            payload: err.response?.data || err.message,
        });
        throw err;
    }
};

const lockScoreCounterByUuid = (uuid: string, workspaceId: string, raceTo: number) => async (dispatch: Dispatch): Promise<string> => {
    dispatch({
        type: types.LOCK_SCORE_COUNTER_REQUEST
    })

    try {
        // console.log(`/api/matches/uuid/${uuid}/lock-score-counter?workspaceId=${workspaceId}`);
        const response = await axios.put(`/api/matches/uuid/${uuid}/lock-score-counter`,
            {},
            {
                params: {
                    workspaceId,
                    raceTo
                }
            }
        );
        dispatch({
            type: types.LOCK_SCORE_COUNTER_SUCCESS,
            payload: response.data
        })

        return response.data
    } catch (err: any) {
        console.log(err);
        dispatch({
            type: types.LOCK_SCORE_COUNTER_FAIL,
            payload: err.response
        })
        throw err
    }
}
const unlockScoreCounterByUuid = (uuid: string, workspaceId: string, tokenLockScoreCounter: string) => async (dispatch: Dispatch): Promise<void> => {
    dispatch({
        type: types.UNLOCK_SCORE_COUNTER_REQUEST
    })

    try {
        await axios.put(`/api/matches/uuid/${uuid}/unlock-score-counter`,
            {},
            {
                params: {
                    workspaceId: workspaceId,
                    token: tokenLockScoreCounter
                }
            }
        );
        dispatch({
            type: types.UNLOCK_SCORE_COUNTER_SUCCESS
        })

    } catch (err: any) {
        console.log(err);
        dispatch({
            type: types.UNLOCK_SCORE_COUNTER_FAIL,
            payload: err.response
        })
        throw err
    }
}
const refreshScoreCounterLockByUuid = async (uuid: string, workspaceId: string, tokenLockScoreCounter: string): Promise<void> => {
    try {
        await axios.put(`/api/matches/uuid/${uuid}/refresh-score-counter-lock`,
            {},
            {
                params: {
                    workspaceId: workspaceId,
                    token: tokenLockScoreCounter
                }
            }
        );
    } catch (err: any) {
        console.log(err);
        throw err
    }
}

const verifyTokenLockCounter = (matchUuid: string, workspaceId: string, token: string) => async (dispatch: Dispatch): Promise<boolean> => {
    dispatch({
        type: types.VERIFY_SCORE_COUNTER_REQUEST
    })
    try {
        const response = await axios.put(`/api/matches/uuid/${matchUuid}/verify-score-counter-token`,
            {},
            {
                params: {
                    workspaceId: workspaceId,
                    token: token
                }
            }
        );
        dispatch({
            type: types.VERIFY_SCORE_COUNTER_SUCCESS
        })
        return response.data
    } catch (err: any) {
        console.log(err);
        dispatch({
            type: types.VERIFY_SCORE_COUNTER_FAIL
        })
        throw err
    }
}

const endMatch = (matchId: string, token: string) => async (dispatch: Dispatch): Promise<void> => {
    dispatch({
        type: types.END_MATCH_REQUEST,
    });

    try {
        const response = await axios.put(`/api/match-score-events/end-match/${matchId}`,
            {},
            {
                params: {
                    token
                }
            }
        );

        dispatch({
            type: types.END_MATCH_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (err: any) {
        dispatch({
            type: types.END_MATCH_FAIL,
            payload: err.response?.data || err.message,
        });
        throw err;
    }
};
const pauseMatch = (matchId: string, token: string) => async (dispatch: Dispatch): Promise<void> => {
    dispatch({
        type: types.PAUSE_MATCH_REQUEST,
    });

    try {
        const response = await axios.put(`/api/match-score-events/pause-match/${matchId}`,
            {},
            {
                params: {
                    token
                }
            }
        );
        dispatch({
            type: types.PAUSE_MATCH_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (err: any) {
        dispatch({
            type: types.PAUSE_MATCH_FAIL,
            payload: err.response?.data || err.message,
        });
        throw err;
    }
};

const matchScoreEventActions = {
    getAllMatchScoreEvents,
    createMatchScoreEvent,
    lockScoreCounterByUuid,
    refreshScoreCounterLockByUuid,
    unlockScoreCounterByUuid,
    verifyTokenLockCounter,
    endMatch,
    pauseMatch
}

export default matchScoreEventActions