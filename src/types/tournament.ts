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

export interface Tournament {
    id: number; //bắt buộc
    workspaceId: number; //bắt buộc
    name: string; //bắt buộc
    tournamentType: TournamentType; //bắt buộc
    tournamentType2?: TournamentType; //bắt buộc
    tournamentType3?: TournamentType; //bắt buộc
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
    listPlayer:Player[]; //bắt buộc
}

export interface TournamentsRequest {
    workspaceId: number;
    name: string;
    tournamentType: TournamentType;
    tournamentType2?: TournamentType;
    tournamentType3?: TournamentType;
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
    playerIds:number[]
}

export interface TournamentsResponse {
  NormalTournament: Record<string, Tournament[]>;
  SpecialDen: Tournament[];
}