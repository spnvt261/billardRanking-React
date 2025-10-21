import { TournamentRoundStatus } from "../types/tournament";

export const tournamentStatusMap = {
    [TournamentRoundStatus.FINISHED]: {
        label: "Đã kết thúc",
        className: "border-red-400 text-red-400",
    },
    [TournamentRoundStatus.ONGOING]: {
        label: "Đang diễn ra",
        className: "border-green-400 text-green-400",
    },
    [TournamentRoundStatus.UPCOMING]: {
        label: "Sắp diễn ra",
        className: "border-yellow-400 text-yellow-400",
    },
    [TournamentRoundStatus.NOT_STARTED]: {
        label: "Không có",
        className: "",
    },
};