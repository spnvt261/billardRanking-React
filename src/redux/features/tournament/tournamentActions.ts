import type { Dispatch } from "redux";
import * as types from "./tournamentTypes";
import axios from "axios";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../../../constants/localStorage";
import type { Tournament, TournamentRoundStatus, TournamentsRequest, TournamentsResponse } from "../../../types/tournament";
import { upLoadImages } from "../common";
import { GET_TOURNAMENT_DETAIL_FAIL, GET_TOURNAMENT_DETAIL_REQUEST, GET_TOURNAMENT_DETAIL_SUCCESS } from "../tournamentDetails/tournamentDetailTypes";

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

const getTournamentById = (id: string, workspaceId: string) => async (dispatch: Dispatch): Promise<Tournament> => {
    dispatch({
        type: GET_TOURNAMENT_DETAIL_REQUEST,
        payload: null,
    });

    try {
        const response = await axios.get<Tournament>("/api/tournaments/" + id, {
            params: {
                workspaceId
            },
        });

        dispatch({
            type: GET_TOURNAMENT_DETAIL_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (error: any) {
        dispatch({
            type: GET_TOURNAMENT_DETAIL_FAIL,
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

const updateTournamentRoundStatus = (tournamentId: string, roundNumber: 1 | 2 | 3, roundStatus: TournamentRoundStatus, workspaceId: string) => async (dispatch: Dispatch): Promise<void> => {
    dispatch({
        type: types.UPDATE_TOURNAMENT_ROUND_STATUS_REQUEST,
    });
    // console.log(3);
    
    try {
        let token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        if (token && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
        }

        if (!token) {
            throw new Error('No access token found');
        }

        // Xác định field cần cập nhật
        let updateField = '';
        switch (roundNumber) {
            case 1:
                updateField = 'round1Status';
                break;
            case 2:
                updateField = 'round2Status';
                break;
            case 3:
                updateField = 'round3Status';
                break;
            default:
                throw new Error('Số vòng không hợp lệ');
        }

        const response = await axios.put(
            `/api/tournaments/${tournamentId}?workspaceId=${workspaceId}`,
            { [updateField]:roundStatus },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        dispatch({
            type: types.UPDATE_TOURNAMENT_ROUND_STATUS_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (err: any) {
        dispatch({
            type: types.UPDATE_TOURNAMENT_ROUND_STATUS_FAIL,
            payload: err.response?.data || err.message,
        });
        throw err;
    }
};

const cleanTournamentDetail = () => (dispatch: Dispatch) => {
    dispatch({
        type: types.CLEAN_TOURNAMENT_DETAIL,
        payload: null
    })
}

const tournamentActions = {
    getAllTournaments,
    createTournament,
    upLoadImages,
    getTournamentById,
    cleanTournamentDetail,
    updateTournamentRoundStatus
}

export default tournamentActions