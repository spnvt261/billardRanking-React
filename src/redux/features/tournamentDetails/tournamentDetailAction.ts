import type { Dispatch } from "redux";
import * as types from './tournamentDetailTypes';
import axios from "axios";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../../../constants/localStorage";
import type { OtherTypeRequest, RoundRobinValuesRequest } from "../../../types/round";
import type { Match } from "../../../types/match";

const createRoundRobin = (data: RoundRobinValuesRequest, workspaceId: string,roundNumber:1|2|3) => async (dispatch: Dispatch): Promise<void> => {
    dispatch({
        type: types.ROUND_ROBIN_REQUEST,
        payload: null,
        roundNumber,
    });

    try {
        let token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        if (token && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1); // bỏ dấu ngoặc kép ở đầu & cuối
        }

        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.post('/api/tournaments/create-round-robin?workspaceId=' + workspaceId, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        dispatch({
            type: types.ROUND_ROBIN_SUCCESS,
            payload: response.data,
            roundNumber,
        });

        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.ROUND_ROBIN_FAIL,
            payload: error,
            roundNumber
        });
        throw error;
    }
};
const createOtherType = (data: OtherTypeRequest, workspaceId: string,roundNumber:1|2|3) => async (dispatch: Dispatch): Promise<void> => {
    dispatch({
        type: types.OTHER_TYPE_REQUEST,
        payload: null,
        roundNumber,
    });

    try {
        let token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        if (token && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1); // bỏ dấu ngoặc kép ở đầu & cuối
        }

        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.post('/api/tournaments/other-round-type?workspaceId=' + workspaceId, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        dispatch({
            type: types.OTHER_TYPE_SUCCESS,
            payload: response.data,
            roundNumber,
        });

        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.OTHER_TYPE_FAIL,
            payload: error,
            roundNumber
        });
        throw error;
    }
};

const getMatchesInTournament = (tournamentId: string, roundNumber: 1 | 2 | 3, workspaceId: string) => async (dispatch: Dispatch): Promise<void> => {
    
    dispatch({
        type: types.GET_MATCHES_REQUEST,
        roundNumber,
    });

    try {
        const response = await axios.get("/api/matches/by-round", {
            params: { tournamentId, roundNumber, workspaceId },
        });

        dispatch({
            type: types.GET_MATCHES_SUCCESS,
            payload: response.data,
            roundNumber,
        });

        return response.data;
    } catch (err) {
        dispatch({
            type: types.GET_MATCHES_FAIL,
            roundNumber,
        });
        throw err;
    }
}

const getRoundRobinRankings = (tournamentId: string, roundNumber: 1 | 2 | 3, workspaceId: string) => async (dispatch: Dispatch): Promise<void> => {
    
    dispatch({
        type: types.ROUND_ROBIN_RANKINGS_REQUEST,
        roundNumber,
    });

    try {
        const response = await axios.get("/api/tournaments/roundrobin-rankings", {
            params: { tournamentId, roundNumber, workspaceId },
        });

        dispatch({
            type: types.ROUND_ROBIN_RANKINGS_SUCCESS,
            payload: response.data,
            roundNumber,
        });

        return response.data;
    } catch (err) {
        dispatch({
            type: types.ROUND_ROBIN_RANKINGS_FAIL,
            roundNumber,
        });
        throw err;
    }
}

const updateMatchInTournament = (matchId:string, newMatch:Match, workspaceId:string,roundNumber: 1 | 2 | 3) => async (dispatch:Dispatch):Promise<void>=>{
    dispatch({
        type: types.UPDATE_MATCH_REQUEST,
        payload:null,
        roundNumber
    });

     try {
        let token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        if (token && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1); // bỏ dấu ngoặc kép ở đầu & cuối
        }

        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.put('/api/matches/'+matchId+'?workspaceId=' + workspaceId, newMatch, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        dispatch({
            type: types.UPDATE_MATCH_SUCCESS,
            payload: response.data,
            roundNumber
        });

        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_MATCH_FAIL,
            payload: error,
            roundNumber
        });
        throw error;
    }
}

const tournamentDetailActions = {
    createRoundRobin,
    getMatchesInTournament,
    updateMatchInTournament,
    getRoundRobinRankings,
    createOtherType
}

export default tournamentDetailActions;