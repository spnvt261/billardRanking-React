// MatchCard.tsx
import { useState, type FC } from "react";
import { FaEdit } from "react-icons/fa";
import { MatchStatus, type Match } from "../../../../../types/match";
import EditMatch from "../editMatch/EditMatch";

interface MatchCardProps {
    match: Match;
}

const MatchCard: FC<MatchCardProps> = ({ match }) => {
    
    
    const [showEdit, setShowEdit] = useState(false);

    const getTeamNames = (players?: { name: string }[]) => {
        if (!players || players.length === 0) return "TBA";
        return players.map(p => p.name).join(" & ");
    };
    // console.log((match.team1?.players));
    const toggleEdit = () => setShowEdit(!showEdit);

    // ✅ Xác định đội thắng
    const isFinished = match.status === MatchStatus.FINISHED;
    const winnerTeam1 = isFinished && match.team1?.id === match.winnerId;
    const winnerTeam2 = isFinished && match.team2?.id === match.winnerId;

    return (
        <>
            <div className="w-[200px] border border-gray-300 rounded shadow-md overflow-hidden">
                {/* Header */}
                <div className="flex relative justify-start items-center bg-gray-300 p-1">
                    <span className="font-semibold text-gray-800 ml-2">#{match.gameNumber || "-"}</span>
                    {match.status === MatchStatus.FINISHED && (
                        <span className="text-[0.6rem] ml-1 px-2 bg-white text-red-500 border border-red-400 rounded-full">
                            {match.status}
                        </span>
                    )}
                    {match.status === MatchStatus.ONGOING && (
                        <span className="text-[0.6rem] ml-1 px-2 bg-white text-green-500 border border-green-400 rounded-full">
                            {match.status}
                        </span>
                    )}
                    {match.status === MatchStatus.UPCOMING && (
                        <span className="text-[0.6rem] ml-1 px-2 bg-white text-yellow-500 border border-yellow-400 rounded-full">
                            {match.status}
                        </span>
                    )}

                    {/* Edit Button */}
                    {match.status !== MatchStatus.FINISHED && match.status !== MatchStatus.ONGOING && (
                        <button
                            className="absolute h-full top-0 right-0 text-gray-600 hover:text-gray-800 w-[30px] h-[30px] flex items-center justify-center"
                            onClick={toggleEdit}
                        >
                            <FaEdit size={18} />
                        </button>
                    )}
                </div>

                {/* Teams */}
                <div className="flex justify-between items-center pl-5 pr-3 py-1 border-b border-gray-300 bg-gray-100">
                    <span className="truncate text-gray-800">{getTeamNames(match.team1?.players)}</span>
                    <span
                        className={`px-2 py-0.5 border text-gray-700 rounded font-semibold ${
                            winnerTeam1 ? " bg-green-500" : " border-gray-400"
                        }`}
                    >
                        {match.status === MatchStatus.UPCOMING ? "-" : match.scoreTeam1}
                    </span>
                </div>

                <div className="flex justify-between items-center pl-5 pr-3 py-1 bg-gray-100">
                    <span className="truncate text-gray-800">{getTeamNames(match.team2?.players)}</span>
                    <span
                        className={`px-2 py-0.5 border rounded text-gray-700 font-semibold ${
                            winnerTeam2 ? "bg-green-500" : "border-gray-400"
                        }`}
                    >
                        {match.status === MatchStatus.UPCOMING ? "-" : match.scoreTeam2}
                    </span>
                </div>
            </div>

            {showEdit && (
                <EditMatch
                    match={match}
                    onClose={toggleEdit}
                />
            )}
        </>
    );
};

export default MatchCard;
