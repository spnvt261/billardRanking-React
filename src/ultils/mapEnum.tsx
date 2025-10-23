import { MatchType } from "../types/match";
import { TournamentRoundStatus, TournamentStatus, TournamentType } from "../types/tournament";

interface Item {
    label: string;
    className?: string; // optional vì không phải item nào cũng có
}

type TournamentStatusMap = {
    [key in TournamentRoundStatus]: Item;
}
export const tournamentStatusMap:TournamentStatusMap = {
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
        label: "Đợi",
        className: "border-blue-600 text-blue-600",
    },
};
type TournamentStatusMapDefault = {
    [key in TournamentStatus]: Item;
}
export const tournamentStatusMapDefault:TournamentStatusMapDefault = {
    [TournamentStatus.FINISHED]: {
        label: "Đã kết thúc",
        className: "border-red-400 text-red-400",
    },
    [TournamentStatus.ONGOING]: {
        label: "Đang diễn ra",
        className: "border-green-400 text-green-400",
    },
    [TournamentStatus.UPCOMING]: {
        label: "Sắp diễn ra",
        className: "border-yellow-400 text-yellow-400",
    },
    [TournamentStatus.PAUSED]: {
        label: "Đợi",
        className: "border-blue-600 text-blue-600",
    },
};

type MatchTypeMap = {
    [key in MatchType]: Item;
}


export const matchTypeMap :MatchTypeMap = {
     [MatchType.GROUP]: {
        label: "Vòng bảng",
        className: ""
    },
    [MatchType.FINAL]: {
        label: "Chung kết",
        className:'text-yellow-500'
    },
    [MatchType.LAST16]: {
        label: "Last16",
    },
    [MatchType.LAST32]: {
        label: "Last32",
    },
    [MatchType.QUARTERFINAL]: {
        label: "Tứ kết",
    },
    [MatchType.SEMIFINAL]: {
        label: "Bán kết",
    },
    [MatchType.THIRD_PLACE]: {
        label: "Tranh hạng ba",
    },
} 

type TournamentTypeEnum = {
    [key in TournamentType]: Item;
}


export const tournamentTypeMapEnum :TournamentTypeEnum = {
     [TournamentType.CUSTOM]: {
        label: "Tự do",
        className: ""
    },
    [TournamentType.DOUBLE_ELIMINATION]: {
        label: "Nhánh thắng/thua",
        className:'text-yellow-500'
    },
    [TournamentType.ROUND_ROBIN]: {
        label: "Vòng tròn",
    },
    [TournamentType.SINGLE_ELIMINATION]: {
        label: "Loại trực tiếp",
    },
    [TournamentType.SPECIAL_DEN]: {
        label: "Đền",
    },
    [TournamentType.SWEDISH]: {
        label: "Thụy điển",
    },
} 