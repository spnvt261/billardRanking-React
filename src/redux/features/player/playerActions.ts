import type { Dispatch } from "redux";
import type { PlayersRequest, PlayersResponse } from "../../../types/player";
import * as types from './playerTypes';
import axios from "axios";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../../../constants/localStorage";
import { upLoadImages } from "../common";

export const getPlayers =
    (workspaceId: string, page: number) =>
        async (dispatch: Dispatch): Promise<PlayersResponse> => {
            dispatch({
                type: types.GET_PLAYERS_REQUEST,
                payload: null,
            });

            try {
                const response = await axios.get<PlayersResponse>("/api/players", {
                    params: {
                        workspaceId,
                        page
                    },
                });
                // console.log(response.data);
                
                dispatch({
                    type: types.GET_PLAYERS_SUCCESS,
                    payload: response.data,
                });

                return response.data;
            } catch (error: any) {
                dispatch({
                    type: types.GET_PLAYERS_FAIL,
                    payload: error,
                });
                throw error;
            }
        };

export const createPlayer =
    (data: PlayersRequest) =>
        async (dispatch: Dispatch): Promise<PlayersResponse> => {
            dispatch({
                type: types.CREATE_PLAYER_REQUEST,
            });

            try {
                let token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
                if (token && token.startsWith('"') && token.endsWith('"')) {
                    token = token.slice(1, -1); // bỏ dấu ngoặc kép ở đầu & cuối
                }

                if (!token) {
                    throw new Error('No access token found');
                }

                const response = await axios.post('/api/players', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                dispatch({
                    type: types.CREATE_PLAYER_SUCCESS,
                    payload: response.data,
                });

                return response.data;
            } catch (err: any) {
                dispatch({
                    type: types.CREATE_PLAYER_FAIL,
                    payload: err.response?.data || err.message,
                });
                throw err;
            }
        };

const playerActions = {
    getPlayers,
    createPlayer,
    upLoadImages
}

export default playerActions;