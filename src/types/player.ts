export interface PlayerSelect{
    value:number; //playerId
    label:string; // playerName
}

export interface Player{
    id:number;
    name:string;
    nickname?:string;
    avatarUrl?:string;
    elo:number;
    description?:string;
    workspaceId:number;
    isFriend?:boolean
    createdAt:string;
    updatedAt:string;
    rank:number;
    seedNumber?:number;
    prize?:number
}

export interface PlayersRequest{
    workspaceId:number | null;
    name:string;
    startElo:number;
    nickname?:string;
    avatarUrl?:string;
    decription?:string;
}

export interface PlayersResponse{
    content:Player[];
    page:number;
    size:number;
    totalElements:number;
    totalPages:number;
    last:boolean;
}