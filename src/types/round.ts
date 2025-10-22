import type { Team } from "./match";

export interface RoundRobinValuesRequest {
    tournamentId:number;
    gameNumberPlayed:number;
    numGroups: number;
    groupSelections: string[][];
    roundNumber: number;
    roundPlayersAfter: number;
}

interface RoundRobinTeam{
    team: Team;
    wins:number;
    losses:number;
    ties:number;
    recentResults:string[]
}

export interface RoundRobinRankingsResponse{
    rankings: Record<number, RoundRobinTeam[]>;
}