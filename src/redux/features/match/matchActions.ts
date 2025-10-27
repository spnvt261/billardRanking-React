import type { Dispatch } from "redux";
import * as types from "./matchTypes";
import type { Match, MatchesRequest, MatchesResponse } from "../../../types/match"
import axios from "axios";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../../../constants/localStorage";

const getMatchesByPage = (workspaceId: string, page: number) => async (dispatch: Dispatch): Promise<MatchesResponse> => {
    dispatch({
        type: types.GET_MATCHES_REQUEST,
        payload: null,
    });

    try {
        const response = await axios.get<MatchesResponse>("/api/matches", {
            params: {
                workspaceId,
                page
            },
        });
        // console.log(response.data);

        dispatch({
            type: types.GET_MATCHES_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_MATCHES_FAIL,
            payload: error,
        });
        throw error;
    }
};

const getMatchById = (workspaceId: string, uuid: string) => async (dispatch: Dispatch): Promise<MatchesResponse> => {
    
    dispatch({
        type: types.GET_MATCH_REQUEST,
        payload: null,
    });

    try {
        const response = await axios.get<MatchesResponse>("/api/matches/uuid/"+uuid, {
            params: {
                workspaceId
            },
        });
        // console.log(response.data);

        dispatch({
            type: types.GET_MATCH_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_MATCH_FAIL,
            payload: error,
        });
        throw error;
    }
};

const createMatch = (data: MatchesRequest) => async (dispatch: Dispatch): Promise<Match> => {
    dispatch({
        type: types.CREATE_MATCH_REQUEST,
    });

    try {
        let token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        if (token && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1); // bỏ dấu ngoặc kép ở đầu & cuối
        }

        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.post('/api/matches', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        dispatch({
            type: types.CREATE_MATCH_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (err: any) {
        dispatch({
            type: types.CREATE_MATCH_FAIL,
            payload: err.response?.data || err.message,
        });
        throw err;
    }
};
const createScoreCounterMatch = (data: MatchesRequest) => async (dispatch: Dispatch): Promise<Match> => {
    dispatch({
        type: types.CREATE_MATCH_REQUEST,
    });

    try {
        const response = await axios.post('/api/matches/create-score-counter', data);

        dispatch({
            type: types.CREATE_MATCH_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (err: any) {
        dispatch({
            type: types.CREATE_MATCH_FAIL,
            payload: err.response?.data || err.message,
        });
        throw err;
    }
};


const matchActions = {
    getMatchesByPage,
    createMatch,
    getMatchById,
    createScoreCounterMatch,
}

export default matchActions