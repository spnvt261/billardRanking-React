import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import viewReducer from "./ui/viewReducer";
import workspaceReducer from "./features/workspace/workspaceReducer";
import playerReducer from "./features/player/playerReducer";
import { CLEAR_CACHE } from "./features/common";
import matchReducer from "./features/match/matchReducer";
import tournamentReducer from "./features/tournament/tournamentReducer";

const appReducer = combineReducers({
    view: viewReducer,
    workspace: workspaceReducer,
    players: playerReducer,
    matches:matchReducer,
    tournaments:tournamentReducer
})

const rootReducer = (state: any, action: any) => {
    if (action.type === CLEAR_CACHE) {
        state = undefined; // reset toàn bộ store 
    }
    
    return appReducer(state, action);
};

const store = createStore(rootReducer, applyMiddleware(thunk))
export type RootState = ReturnType<typeof rootReducer>;
export default store;   