import type { FC } from "react";
import { FiEdit3, FiPlus } from "react-icons/fi";

export const MatchStatus = {
    ONGOING: "ONGOING",
    FINISHED: "FINISHED",
    NOT_STARTED: "NOT_STARTED",
    UPCOMING: "UPCOMING",
} as const;

export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus];

interface MatchCardProps {
    team1Name: string;
    team2Name: string;
    team1Score?: number;
    team2Score?: number;
    status?: MatchStatus;
    onEdit?: () => void;
}

const MatchCard: FC<MatchCardProps> = ({
    team1Name,
    team2Name,
    team1Score,
    team2Score,
    status = MatchStatus.NOT_STARTED,
    onEdit,
}) => {
    const isCompleted = status === MatchStatus.FINISHED;

    return (
        <div className="p-2 bg-gray-100 rounded-2xl w-[150px] shadow-sm border border-gray-200 text-slate-500">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium truncate">{team1Name}</span>
                <span className="text-lg font-semibold">
                    {isCompleted ? team1Score : "-"}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium truncate">{team2Name}</span>
                <span className="text-lg font-semibold">
                    {isCompleted ? team2Score : "-"}
                </span>
            </div>

            <div className="flex justify-end mt-3">
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                    {isCompleted ? (
                        <>
                            <FiEdit3 className="text-slate-600" /> Edit
                        </>
                    ) : (
                        <>
                            <FiPlus className="text-slate-600" /> Add Result
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default MatchCard;
