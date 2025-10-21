export interface RoundRobinValuesRequest {
    tournamentId:number;
    numGroups: number;
    groupSelections: string[][];
    roundNumber: number;
    roundPlayersAfter: number;
}