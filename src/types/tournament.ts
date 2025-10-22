import type { Team } from "./match";
import type { Player } from "./player";

export const TournamentType = {
    ROUND_ROBIN: "ROUND_ROBIN",
    SINGLE_ELIMINATION: "SINGLE_ELIMINATION",
    DOUBLE_ELIMINATION: "DOUBLE_ELIMINATION",
    CUSTOM: "CUSTOM",
    SWEDISH: "SWEDISH",
    SPECIAL_DEN: "SPECIAL_DEN"
} as const;
export type TournamentType = typeof TournamentType[keyof typeof TournamentType];

export const TournamentStatus = {
    ONGOING: "ONGOING",
    UPCOMING: "UPCOMING",
    FINISHED: "FINISHED",
    PAUSED: "PAUSED"
} as const;
export type TournamentStatus = typeof TournamentStatus[keyof typeof TournamentStatus];

export const TournamentFormat = {
    SINGLE: "SINGLE",
    DOUBLES: "DOUBLES",
} as const;
export type TournamentFormat = typeof TournamentFormat[keyof typeof TournamentFormat];

export const TournamentRoundStatus = {
    ONGOING: "ONGOING",
    FINISHED: "FINISHED",
    NOT_STARTED: "NOT_STARTED",
    UPCOMING:"UPCOMING"
} as const;
export type TournamentRoundStatus = typeof TournamentRoundStatus[keyof typeof TournamentRoundStatus];

export interface TournamentDetail {
    id: number; //bắt buộc
    workspaceId: number; //bắt buộc
    name: string; //bắt buộc
    tournamentType: TournamentType; //bắt buộc
    round1PlayersAfter?:number;
    round1Status: TournamentRoundStatus;
    tournamentType2?: TournamentType; 
    round2PlayersAfter?:number
    round2Status: TournamentRoundStatus;
    tournamentType3?: TournamentType; 
    round3Status: TournamentRoundStatus;
    startDate: string; //bắt buộc
    endDate?: string; 
    location?: string;
    prize: number; //bắt buộc
    winnerId?: number;
    runnerUpId?: number;
    thirdPlaceId?: number;
    winner?: Player;
    runnerUp?: Player;
    thirdPlace?: Player;
    description?: string;
    rules?: string;
    banner?: string;
    status: TournamentStatus; //bắt buộc
    createdAt?:string;
    updatedAt?:string;
    format:TournamentFormat
    listPlayer:Player[]; //bắt buộc
    listTeamByRound:Record<number, Team[]>
}

export interface TournamentsRequest {
    workspaceId: number;
    name: string;
    tournamentType?: TournamentType;
    round1PlayersAfter?:number;
    round1Status: TournamentRoundStatus;
    tournamentType2?: TournamentType;
    round2PlayersAfter?:number
    round2Status: TournamentRoundStatus;
    tournamentType3?: TournamentType;
    round3Status: TournamentRoundStatus;
    startDate: string;
    endDate?: string;
    location?: string;
    prize: number;
    winnerId?: number;
    runnerUpId?: number;
    thirdPlaceId?: number;
    description?: string;
    rules?: string;
    banner?: File |string | null;
    status: TournamentStatus;
    playerIds:number[];
    format:TournamentFormat
}

export interface Tournament {
    id: number; //bắt buộc
    workspaceId: number; //bắt buộc
    name: string; //bắt buộc
    tournamentType: TournamentType; //bắt buộc
    round1PlayersAfter?:number
    tournamentType2?: TournamentType; 
    round2PlayersAfter?:number
    tournamentType3?: TournamentType; 
    startDate: string; //bắt buộc
    endDate?: string; 
    location?: string;
    prize: number; //bắt buộc
    winnerId?: number;
    runnerUpId?: number;
    thirdPlaceId?: number;
    winner?: Player;
    runnerUp?: Player;
    thirdPlace?: Player;
    description?: string;
    rules?: string;
    banner?: string;
    status: TournamentStatus; //bắt buộc
    createdAt?:string;
    updatedAt?:string;
    format:TournamentFormat
    numberAttend:number;
    numberTeams:number;
    listPlayer:Player[]; //bắt buộc
}

export interface TournamentsResponse {
  NormalTournament: Record<string, Tournament[]>;
  SpecialDen: Tournament[];
}