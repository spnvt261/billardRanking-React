

interface Action {
    type: string;
    payload?: any;
}

interface InitState{
    
}

const initState:InitState = {
    
}

const viewReducer = (state = initState, action: Action) => {
    switch (action.type) {
        default:
            return state
    }
}

export default viewReducer