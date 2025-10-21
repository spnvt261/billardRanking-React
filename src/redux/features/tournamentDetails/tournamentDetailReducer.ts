import * as types from './tournamentDetailTypes';
interface TournamentDetailAction {
    type: string;
    payload?: any;
}
interface State {
    isLoading: boolean;
}

const initState: State = {
    isLoading: false,
};


const playerReducer = (state = initState, action: TournamentDetailAction) => {

    switch (action.type) {
        //Request
        case types.ROUND_ROBIN_REQUEST:
            return{
                ...state,
                isLoading:true,
            }
        //success
        case types.ROUND_ROBIN_SUCCESS:
            return{
                ...state,
                isLoading:false,
            }
        

        //fail
        case types.ROUND_ROBIN_REQUEST:
            return{
                ...state,
                isLoading:false,
            }
        //clean
       

        default:
            return state;
    }
}

export default playerReducer;