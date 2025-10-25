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
import TestComponent from "../assets/TestComponent";
import SettingPage from "../pages/SettingPage/SettingPage";
import TournamentDetailLayout from "../pages/TournamentDetailPage/TournamentDetailLayout";
import TournamentOverview from "../pages/TournamentDetailPage/TournamentOverview/TournamentOverview";
import TournamentPlayers from "../pages/TournamentDetailPage/TournamentPlayers/TournamentPlayer";
import TournamentRanking from "../pages/TournamentDetailPage/TournamentRanking/TournamentRanking";
import TournamentMatches from "../pages/TournamentDetailPage/TournamentMatches/TournamentMatches";
import WithLoading from "../components/loading/WithLoading";
import ScoreCounterPage from "../pages/ScoreCounterPage/ScoreCounterPage";

const AppRouters =()=>{
    const TournamentMatchesWithLoading = WithLoading(TournamentMatches);
    const TournamentOverviewWithLoading = WithLoading(TournamentOverview);
    const TournamentPlayersWithLoading = WithLoading(TournamentPlayers);
    const TournamentRankingWithLoading = WithLoading(TournamentRanking);
    const TournamentDetailLayoutWithLoading = WithLoading(TournamentDetailLayout);
    return(
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path={PATHS.RANKINGS} element={<ProtectedRoute><RankingPage/></ProtectedRoute> }/>
                <Route path={PATHS.MATCHES} element={<ProtectedRoute><MatchesPage/></ProtectedRoute> }/>
                <Route path={PATHS.TOURNAMENT} element={<ProtectedRoute><TournamentPage/></ProtectedRoute> }/>
                <Route path={`${PATHS.TOURNAMENT}/:id`} element={<ProtectedRoute><TournamentDetailLayoutWithLoading/></ProtectedRoute>}>
                    <Route index element={<TournamentOverviewWithLoading />} /> 
                    <Route path={PATHS.TOURNAMENT_DETAIL_MATCHES} element={<TournamentMatchesWithLoading />} /> 
                    <Route path={PATHS.TOURNAMENT_DETAIL_PLAYERS} element={<TournamentPlayersWithLoading />} /> 
                    <Route path={PATHS.TOURNAMENT_DETAIL_RANKINGS} element={<TournamentRankingWithLoading />} /> 
                </Route>    
                <Route path={PATHS.OVERALL} element={<ProtectedRoute><OverallPage/></ProtectedRoute> }/>
                <Route path="*" element={<NotFoundPage/>}/>
                <Route path={PATHS.CREATE_TOURNAENT} element={<CreateTournamentPage/>}/>
                <Route path={PATHS.SETTINGS} element ={<ProtectedRoute><SettingPage/></ProtectedRoute>}/>
                <Route path="/test" element={<TestComponent/>}/>
            </Route>
            <Route path={`${PATHS.SCORE_COUNTER}/:uuid`} element={<ProtectedRoute><ScoreCounterPage/></ProtectedRoute> }/>
        </Routes>
    )
}

export default AppRouters;