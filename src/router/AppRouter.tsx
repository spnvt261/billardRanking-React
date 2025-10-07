import { Routes, Route} from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import PATHS from "./path";
import RankingPage from "../pages/RankingPage/RankingPage";
import MatchsPage from "../pages/MatchsPage/MatchsPage";
import TournamentPage from "../pages/TournamentPage/TournamentPage";
import OverallPage from "../pages/OverallPage/OverallPage";

const AppRouters =()=>{
    return(
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/"/>
                <Route path={PATHS.RANKINGS} element={<RankingPage/>}/>
                <Route path={PATHS.MATCHS} element={<MatchsPage/>}/>
                <Route path={PATHS.TOURNAMENT} element={<TournamentPage/>}/>
                <Route path={PATHS.OVERALL} element={<OverallPage/>}/>
            </Route>
        </Routes>
    )
}

export default AppRouters;