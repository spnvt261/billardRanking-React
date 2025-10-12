import { Routes, Route} from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import PATHS from "./path";
import RankingPage from "../pages/RankingPage/RankingPage";
import TournamentPage from "../pages/TournamentPage/TournamentPage";
import OverallPage from "../pages/OverallPage/OverallPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import MatchesPage from "../pages/MatchsPage/MatchsPage";
import Home from "../pages/HomePage/HomePage";
import CreateTournamentPage from "../pages/CreateTournamentPage/CreateTournamentPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRouters =()=>{
    return(
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path={PATHS.RANKINGS} element={<ProtectedRoute><RankingPage/></ProtectedRoute> }/>
                <Route path={PATHS.MATCHES} element={<ProtectedRoute><MatchesPage/></ProtectedRoute> }/>
                <Route path={PATHS.TOURNAMENT} element={<ProtectedRoute><TournamentPage/></ProtectedRoute> }/>
                <Route path={PATHS.OVERALL} element={<ProtectedRoute><OverallPage/></ProtectedRoute> }/>
                <Route path={PATHS.NOTFOUND} element={<NotFoundPage/>}/>
                <Route path={PATHS.CREATE_TOURNAENT} element={<CreateTournamentPage/>}/>
            </Route>
        </Routes>
    )
}

export default AppRouters;