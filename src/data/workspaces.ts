interface iWorkspace {
  id: number;
  name: string;
  share_key: number;
}

export const workspaces: iWorkspace[] = [
  { id: 1, name: "Workspace Alpha", share_key: 12345678 },
  { id: 2, name: "Workspace Beta", share_key: 87654321 },
  { id: 3, name: "Workspace Gamma", share_key: 13572468 },
  { id: 4, name: "Workspace Delta", share_key: 24681357 },
  { id: 5, name: "Workspace Epsilon", share_key: 19283746 },
];
