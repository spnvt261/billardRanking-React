import { TournamentType } from "../types/tournament";

  export const tournamentTypeOptions = [
    { label: "Vòng tròn", value: TournamentType.ROUND_ROBIN },
    { label: "Loại trực tiếp", value: TournamentType.SINGLE_ELIMINATION },
    { label: "Nhánh thắng/thua", value: TournamentType.DOUBLE_ELIMINATION },
    { label: "Thụy điển", value: TournamentType.SWEDISH },
    { label: "Tự do", value: TournamentType.CUSTOM },

];