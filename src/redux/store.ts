import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import viewReducer from "./ui/viewReducer";
import workspaceReducer from "./features/workspace/workspaceReducer";

const rootReducer = combineReducers({
    view: viewReducer,
    workspace: workspaceReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))
export type RootState = ReturnType<typeof rootReducer>;
export default store;   