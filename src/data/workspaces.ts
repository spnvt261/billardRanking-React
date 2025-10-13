interface iWorkspace {
  id: number;
  name: string;
  share_key: number;
  password?: string;
  isAdmin?: boolean;
}

export const workspaces: iWorkspace[] = [
  { id: 1, name: "Workspace Alpha", share_key: 12345678,isAdmin:true, password:"admin" },
  { id: 2, name: "Workspace Beta", share_key: 87654321 },
];
