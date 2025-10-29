import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PATHS from "./path";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import WithLoading from "../components/loading/WithLoading";
import ProtectedRoute from "./ProtectedRoute";

const Home = lazy(() => import("../pages/HomePage/HomePage"));
const RankingPage = lazy(() => import("../pages/RankingPage/RankingPage"));
const TournamentPage = lazy(() => import("../pages/TournamentPage/TournamentPage"));
const OverallPage = lazy(() => import("../pages/OverallPage/OverallPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage/NotFoundPage"));
const MatchesPage = lazy(() => import("../pages/MatchsPage/MatchsPage"));
const CreateTournamentPage = lazy(() => import("../pages/CreateTournamentPage/CreateTournamentPage"));
const SettingPage = lazy(() => import("../pages/SettingPage/SettingPage"));
const ScoreCounterPage = lazy(() => import("../pages/ScoreCounterPage/ScoreCounterPage"));
const TournamentDetailLayout = lazy(() => import("../pages/TournamentDetailPage/TournamentDetailLayout"));
const TournamentOverview = lazy(() => import("../pages/TournamentDetailPage/TournamentOverview/TournamentOverview"));
const TournamentPlayers = lazy(() => import("../pages/TournamentDetailPage/TournamentPlayers/TournamentPlayer"));
const TournamentRanking = lazy(() => import("../pages/TournamentDetailPage/TournamentRanking/TournamentRanking"));
const TournamentMatches = lazy(() => import("../pages/TournamentDetailPage/TournamentMatches/TournamentMatches"));
const TestComponent = lazy(() => import("../assets/TestComponent"));


const AppRouters = () => {
    const TournamentMatchesWithLoading = WithLoading(TournamentMatches);
    const TournamentOverviewWithLoading = WithLoading(TournamentOverview);
    const TournamentPlayersWithLoading = WithLoading(TournamentPlayers);
    const TournamentRankingWithLoading = WithLoading(TournamentRanking);
    const TournamentDetailLayoutWithLoading = WithLoading(TournamentDetailLayout);
    return (
        <Suspense fallback={<div></div>}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path={PATHS.RANKINGS} element={<ProtectedRoute><RankingPage /></ProtectedRoute>} />
                    <Route path={PATHS.MATCHES} element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
                    <Route path={PATHS.TOURNAMENT} element={<ProtectedRoute><TournamentPage /></ProtectedRoute>} />
                    <Route path={`${PATHS.TOURNAMENT}/:id`} element={<ProtectedRoute><TournamentDetailLayoutWithLoading /></ProtectedRoute>}>
                        <Route index element={<TournamentOverviewWithLoading />} />
                        <Route path={PATHS.TOURNAMENT_DETAIL_MATCHES} element={<TournamentMatchesWithLoading />} />
                        <Route path={PATHS.TOURNAMENT_DETAIL_PLAYERS} element={<TournamentPlayersWithLoading />} />
                        <Route path={PATHS.TOURNAMENT_DETAIL_RANKINGS} element={<TournamentRankingWithLoading />} />
                    </Route>
                    <Route path={PATHS.OVERALL} element={<ProtectedRoute><OverallPage /></ProtectedRoute>} />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path={PATHS.CREATE_TOURNAENT} element={<CreateTournamentPage />} />
                    <Route path={PATHS.SETTINGS} element={<ProtectedRoute><SettingPage /></ProtectedRoute>} />
                    <Route path="/test" element={<TestComponent />} />
                </Route>
                <Route path={`${PATHS.SCORE_COUNTER}/:uuid`} element={<ProtectedRoute><ScoreCounterPage /></ProtectedRoute>} />
            </Routes>
        </Suspense>
    )
}

export default AppRouters;