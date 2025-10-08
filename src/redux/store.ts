import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import viewReducer from "./ui/viewReducer";

const rootReducer = combineReducers({
    view: viewReducer
})

const store = createStore(rootReducer, applyMiddleware(thunk))
export type RootState = ReturnType<typeof rootReducer>;
export default store;   