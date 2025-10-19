import type { Dispatch } from "redux";
import * as types from "./tournamentTypes";
import axios from "axios";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../../../constants/localStorage";
import type { Tournament, TournamentsRequest, TournamentsResponse } from "../../../types/tournament";
import { upLoadImages } from "../common";

const getAllTournaments = (workspaceId: string) => async (dispatch: Dispatch): Promise<TournamentsResponse> => {
    dispatch({
        type: types.GET_TOURNAMENTS_REQUEST,
        payload: null,
    });

    try {
        const response = await axios.get<TournamentsResponse>("/api/tournaments/get-all", {
            params: {
                workspaceId
            },
        });
        // console.log(response.data);

        dispatch({
            type: types.GET_TOURNAMENTS_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_TOURNAMENTS_FAIL,
            payload: error,
        });
        throw error;
    }
};

const getTournamentById = (id:string, workspaceId: string) => async (dispatch: Dispatch): Promise<Tournament> => {
    dispatch({
        type: types.GET_ONE_TOURNAMENT_REQUEST,
        payload: null,
    });

    try {
        const response = await axios.get<Tournament>("/api/tournaments/"+id, {
            params: {
                workspaceId
            },
        });

        dispatch({
            type: types.GET_ONE_TOURNAMENT_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_ONE_TOURNAMENT_FAIL,
            payload: error,
        });
        throw error;
    }
};

const createTournament = (data: TournamentsRequest) => async (dispatch: Dispatch): Promise<TournamentsResponse> => {
    dispatch({
        type: types.CREATE_TOURNAMENT_REQUEST,
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
            type: types.CREATE_TOURNAMENT_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (err: any) {
        dispatch({
            type: types.CREATE_TOURNAMENT_FAIL,
            payload: err.response?.data || err.message,
        });
        throw err;
    }
};

const tournamentActions = {
    getAllTournaments,
    createTournament,
    upLoadImages,
    getTournamentById
}

export default tournamentActions