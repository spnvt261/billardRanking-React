import type { Team } from "./match";

export interface MatchScoreEvent {
    id: number
    workspaceId: number;
    tournamentId?: number;
    matchId: number;
    teamId: number;
    team:Team
    playerId?: number;
    rackNumber: number;
    pointsReceived: number;
    note?: string
    isSynced: boolean;
    retryCount: number;
    lastAttempt: string | null;
}

export interface MatchScoreEventRequest {
    workspaceId: number;
    tournamentId?: number;
    matchId?: number;
    teamId: number;
    playerId?: number;
    rackNumber: number;
    pointsReceived: number;
    note?: string
    isSynced: boolean;
    retryCount: number;
    lastAttempt: string | null;
}

export interface AllMatchScoreEventsResponse {
    content: MatchScoreEvent[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}