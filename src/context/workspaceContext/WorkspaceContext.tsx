import React, { createContext } from "react";
import { useLocalStorage } from "../../customhook/useLocalStorage";
import { LOCAL_STORAGE_WORKSPACE_CURRENT, LOCAL_STORAGE_WORKSPACE_LIST } from "../../constants/localStorage";
import type { WorkspaceData } from "../../types/workspace";

interface WorkspaceContextType {
    workspaceKey: string | null;
    setWorkspaceKey: (key: string | null) => void;
    workspaceList: WorkspaceData[];
    addWorkspace: (workspace: WorkspaceData) => void;
    removeWorkspace: (shareKey: string) => void;
    hasWorkspace:(shareKey: string) => boolean;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [workspaceList, setWorkspaceList] = useLocalStorage<WorkspaceData[]>(LOCAL_STORAGE_WORKSPACE_LIST, []);
    const [workspaceKey, setWorkspaceKey] = useLocalStorage<string | null>(LOCAL_STORAGE_WORKSPACE_CURRENT, null);

    // Thêm workspace mới, tránh duplicate theo shareKey
    const addWorkspace = (workspace: WorkspaceData) => {
        if (!workspaceList.some(w => w && w.shareKey === workspace.shareKey)) {
            setWorkspaceList([...workspaceList, workspace]);
        }
    };


    // Xóa workspace theo shareKey
    const removeWorkspace = (shareKey: string) => {
        const newList = workspaceList.filter(w => w.shareKey.toString() !== shareKey);
        setWorkspaceList(newList);

        if (workspaceKey === shareKey) {
            setWorkspaceKey(null);
        }
    };

    // Kiểm tra workspace có tồn tại trong list không
    const hasWorkspace = (shareKey: string): boolean => {
        return workspaceList.some(w => w.shareKey.toString() === shareKey);
    };

    const value = React.useMemo(
        () => ({
            workspaceKey,
            workspaceList,
            setWorkspaceKey,
            addWorkspace,
            removeWorkspace,
            hasWorkspace,
        }),
        [workspaceKey, workspaceList]
    );

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
};