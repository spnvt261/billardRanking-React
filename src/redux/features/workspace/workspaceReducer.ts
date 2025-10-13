import * as types from './workspaceTypes';
const initState={
    isLoading:false,
    workspaceInfo:{
    },
    message:''
}

const workspaceReducer=(state=initState,action:any)=>{
    switch(action.type){
        //Request
        case types.LOGIN_WORKSPACE_REQUEST:
        case types.GET_WORKSPACE_REQUEST:
        case types.CREATE_WORKSPACE_REQUEST:
            return{
                ...state,
                isLoading:true
            }

        //success
        case types.CREATE_WORKSPACE_SUCCESS:
            return{
                ...state,
                isLoading:false,
            }
        case types.GET_WORKSPACE_SUCCESS:
            return{
                ...state,
                isLoading:false,
                workspaceInfo:action.payload
            }
        case types.LOGIN_WORKSPACE_SUCCESS:
            return{
                ...state,
                isLoading:false,
                workspaceInfo:action.payload
            }

        //fail
        case types.LOGIN_WORKSPACE_FAIL:
        case types.GET_WORKSPACE_FAIL:
        case types.CREATE_WORKSPACE_FAIL:   
            return{
                ...state,
                isLoading:false,
                message:action.payload
            }
        default:
            return state;
    }
}

export default workspaceReducer;