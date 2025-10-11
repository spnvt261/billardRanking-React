import { Routes, Route} from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import PATHS from "./path";
import RankingPage from "../pages/RankingPage/RankingPage";
import TournamentPage from "../pages/TournamentPage/TournamentPage";
import OverallPage from "../pages/OverallPage/OverallPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import MatchesPage from "../pages/MatchsPage/MatchsPage";

const AppRouters =()=>{
    return(
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/"/>
                <Route path={PATHS.RANKINGS} element={<RankingPage/>}/>
                <Route path={PATHS.MATCHES} element={<MatchesPage/>}/>
                <Route path={PATHS.TOURNAMENT} element={<TournamentPage/>}/>
                <Route path={PATHS.OVERALL} element={<OverallPage/>}/>
                <Route path={PATHS.NOTFOUND} element={<NotFoundPage/>}/>
            </Route>
        </Routes>
    )
}

export default AppRouters;