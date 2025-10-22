import type { Team } from "./match";
import type { TournamentType } from "./tournament";

export interface RoundRobinValuesRequest {
    tournamentId:number;
    gameNumberPlayed:number;
    numGroups: number;
    groupSelections: string[][];
    roundNumber: number;
    roundPlayersAfter: number;
}
export interface OtherTypeRequest {
    tournamentId:number;
    gameNumberPlayed:number;
    roundNumber: number;
    listPlayerIds: number[];
    roundPlayersAfter:number;
    roundType:TournamentType|""
}
interface RoundRobinTeam{
    team: Team;
    wins:number;
    losses:number;
    ties:number;
    matchesPlayed:number;
    matchesTotal:number;
    recentResults:string[]
}

export interface RoundRobinRankingsResponse{
    rankings: Record<number, RoundRobinTeam[]>;
}