import viewTypes from "./viewTypes"

interface Action {
    type: string;
    payload?: any;
}

interface InitState{
    addPlayerFormIsOpen: boolean
}

const initState:InitState = {
    addPlayerFormIsOpen: false
}

const viewReducer = (state = initState, action: Action) => {
    switch (action.type) {
        case viewTypes.OPEN_ADD_PLAYER_FORM:
            return {
                ...state,
                addPlayerFormIsOpen: true
            }
        case viewTypes.CLOSE_ADD_PLAYER_FORM:
            return {
                ...state,
                addPlayerFormIsOpen: false
            }
        default:
            return state
    }
}

export default viewReducer