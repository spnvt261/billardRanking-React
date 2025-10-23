import { TournamentType } from "../types/tournament";

export const tournamentTypeOptions = [
  { label: "Vòng tròn", value: TournamentType.ROUND_ROBIN },
  { label: "Loại trực tiếp", value: TournamentType.SINGLE_ELIMINATION },
  { label: "Nhánh thắng/thua(updateing)", value: TournamentType.DOUBLE_ELIMINATION },
  { label: "Thụy điển(updateing)", value: TournamentType.SWEDISH },
  { label: "Tự do(updateing)", value: TournamentType.CUSTOM },

];