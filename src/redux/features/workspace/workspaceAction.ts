import * as types from './workspaceTypes';
import axios from 'axios';

export interface CreateWorkspaceResponse{
    success:string;
    message:string;
    workspaceId:number;
}
const createWorkspace = (workspaceData: types.WorkspaceDataToCreate) => async (dispatch: any) : Promise<CreateWorkspaceResponse> => {
    dispatch({ 
        type: types.CREATE_WORKSPACE_REQUEST ,
        payload:null
    });
    try {
        const response = await axios.post('/api/test/create-workspace', workspaceData);
        dispatch({ type: types.CREATE_WORKSPACE_SUCCESS, payload: response.data });
        return response.data;
    } catch (error: any) {
        dispatch({ type: types.CREATE_WORKSPACE_FAIL, payload: error.message });
        throw error;
    }
}

export interface CheckWorkspaceResponse {
  exists: boolean;
  workspace: types.WorkspaceData | null;
}

const joinWorkspace =(workspaceKey: { shareKey: Number }) => async (dispatch:any) : Promise<CheckWorkspaceResponse> =>{
    dispatch({
        type:types.GET_WORKSPACE_REQUEST,
        payload:null
    });
    try{
        const response = await axios.post('/api/test/check-share-key', workspaceKey);
        dispatch({
            type: types.GET_WORKSPACE_SUCCESS,
            payload:response.data,
        })
        return response.data;
    } catch (err:any){
        dispatch({
            type:types.GET_WORKSPACE_FAIL,
            payload:err.message
        })
        throw err;
    }
}

export interface LoginWorkspaceResponse{
    success:string;
    message:string;
    workspace:types.WorkspaceData | null;
}
const loginWorkspace = (data:{shareKey:Number,password:string}) => async (dispatch:any): Promise<LoginWorkspaceResponse>  =>{
     dispatch({
        type:types.LOGIN_WORKSPACE_REQUEST,
        payload:null
    });
    try{
        const response = await axios.post('/api/test/login-workspace', data);
        dispatch({
            type: types.LOGIN_WORKSPACE_SUCCESS,
            payload:response.data,
        })
        return response.data;
    } catch (err:any){
        dispatch({
            type:types.LOGIN_WORKSPACE_FAIL,
            payload:err.message
        })
        throw err;
    }
}

const workspaceAction = {
    createWorkspace,
    joinWorkspace,
    loginWorkspace
};

export default workspaceAction;
