import type { Player } from "./player";
import type { TournamentType } from "./tournament";

const MatchType = {
    GROUP: 'Vòng bảng',
    QUARTERFINAL: 'Tứ kết',
    SEMIFINAL: 'Bán kết',
    FINAL: 'Chung kết',
    THIRD_PLACE: 'Tranh hạng ba',
    LAST16: 'Last16',
    LAST32: 'Last32'
} as const;
export type MatchType = typeof MatchType[keyof typeof MatchType];

export const MatchCategory = {
    TOURNAMENT: 'TOURNAMENT',
    FUN: 'FUN',
    BETTING: 'BETTING'
} as const;
export type MatchCategory = typeof MatchCategory[keyof typeof MatchCategory];

export const MatchStatus = {
    ONGOING: "ONGOING",
    FINISHED: "FINISHED",
    NOT_STARTED: "NOT_STARTED",
    UPCOMING:"UPCOMING"
} as const;
export type MatchStatus = typeof MatchStatus[keyof typeof MatchStatus];

export interface Team {
    id: number
    workspaceId:number
    name: string
    players: Player[]
    createdAt:string
    updatedAt:string
}

export interface Match {
    id: number; //bắt buộc
    workspaceId: number; //bắt buộc
    tournamentId?: number;
    tournamentRoundType?: TournamentType;
    team1Id: number
    team2Id: number
    team1?: Team
    team2?: Team
    scoreTeam1: number
    scoreTeam2: number
    matchType: MatchType
    matchCategory: MatchCategory
    betAmount?: number
    matchDate?: string
    note?: string
    round?:number;
    gameNumber?:number;
    winnerId?: number;
    status:MatchStatus
    createdAt: string
    updatedAt: string
}

export interface MatchesRequest {
    workspaceId: number;
    team1Players:number[];
    team2Players:number[];
    tournamentId?: number;
    team1Id?: number;
    team2Id?: number;
    winnerId?: number;
    scoreTeam1: number;
    scoreTeam2: number;
    matchType?: MatchType;
    matchCategory: MatchCategory;
    betAmount?: number;
    matchDate?: string;
    note?: string;
    status:MatchStatus
}

export interface MatchesResponse {
    content: Match[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}