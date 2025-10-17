import type { Player } from "./player";

const TournamentType = {
    ROUND_ROBIN: "ROUND_ROBIN",
    SINGLE_ELIMINATION: "SINGLE_ELIMINATION",
    DOUBLE_ELIMINATION: "DOUBLE_ELIMINATION",
    CUSTOM: "CUSTOM",
    ROUND_ROBIN_AND_SINGLE_ELIMINATION: "ROUND_ROBIN_AND_SINGLE_ELIMINATION",
    SWEDISH: "SWEDISH"
} as const;
export type TournamentType = typeof TournamentType[keyof typeof TournamentType];

const TournamentStatus = {
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
    startDate: string;
    endDate?: string;
    location?: string;
    prize: number;
    winnerId?: number;
    runnerUpId?: number;
    thirdPlaceId?: number;
    description?: string;
    rules?: string;
    banner?: string;
    status: TournamentStatus;
    playerIds:number[]
}

export interface TournamentsResponse {
    content: Tournament[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}