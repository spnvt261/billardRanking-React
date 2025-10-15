import type { CheckWorkspaceResponse, CreateWorkspaceResponse, LoginWorkspaceResponse, WorkspaceDataToCreate } from '../../../types/workspace';
import * as types from './workspaceTypes';
import axios from 'axios';


const createWorkspace = (workspaceData: WorkspaceDataToCreate) => async (dispatch: any) : Promise<CreateWorkspaceResponse> => {
    dispatch({ 
        type: types.CREATE_WORKSPACE_REQUEST ,
        payload:null
    });
    try {
        const response = await axios.post('/api/test/create-workspace', workspaceData);
        dispatch({ type: types.CREATE_WORKSPACE_SUCCESS, payload: response.data });
        return response.data;
    } catch (error: any) {
        dispatch({ type: types.CREATE_WORKSPACE_FAIL, payload: error });
        throw error;
    }
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
            payload:err
        })
        throw err;
    }
}

const loginWorkspace = (data:{workspaceKey:Number,password:string}) => async (dispatch:any): Promise<LoginWorkspaceResponse>  =>{
     dispatch({
        type:types.LOGIN_WORKSPACE_REQUEST,
        payload:null
    });
    try{
        // const response = await axios.post('/api/test/login-workspace', data);
        const response = await axios.post('/api/auth/login', data);
        dispatch({
            type: types.LOGIN_WORKSPACE_SUCCESS,
            payload:response.data,
        })
        return response.data;
    } catch (err:any){
        dispatch({
            type:types.LOGIN_WORKSPACE_FAIL,
            payload:err
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
