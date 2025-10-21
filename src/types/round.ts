export interface RoundRobinValuesRequest {
    tournamentId:number;
    gameNumberPlayed:number;
    numGroups: number;
    groupSelections: string[][];
    roundNumber: number;
    roundPlayersAfter: number;
}