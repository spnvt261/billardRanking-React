export interface WorkspaceData {
    id: number;
    name: string;
    shareKey: number;
    isAdmin?:boolean;
    showKey:boolean
}

export interface WorkspaceDataToCreate {
    name: string;
    password: string;
    shareKey: number;
}

export interface CreateWorkspaceResponse{
    success:string;
    message:string;
    workspaceId:number;
}

export interface CheckWorkspaceResponse {
  exists: boolean;
  workspace: WorkspaceData | null;
}

export interface LoginWorkspaceResponse{
    accessToken:string;
    refreshToken:string;
    tokenType:string;
    workspace:WorkspaceData | null;
}