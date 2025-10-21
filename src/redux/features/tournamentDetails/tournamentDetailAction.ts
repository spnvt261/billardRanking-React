import type { Dispatch } from "redux";
import * as types from './tournamentDetailTypes';
import axios from "axios";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../../../constants/localStorage";
import type { RoundRobinValuesRequest } from "../../../types/round";

const createRoundRobin = (data: RoundRobinValuesRequest,workspaceId:string) => async (dispatch: Dispatch): Promise<void> => {
    dispatch({
        type: types.ROUND_ROBIN_REQUEST,
        payload: null,
    });

    try {
        let token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        if (token && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1); // bỏ dấu ngoặc kép ở đầu & cuối
        }

        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.post('/api/tournaments/create-round-robin?workspaceId='+workspaceId, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        dispatch({
            type: types.ROUND_ROBIN_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.ROUND_ROBIN_FAIL,
            payload: error,
        });
        throw error;
    }
};


const tournamentDetailActions = {
    createRoundRobin
}

export default tournamentDetailActions;