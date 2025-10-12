import React, { createContext, useState, useContext } from "react";
import { ACCESS_TOKEN, LOCAL_STORAGE_WORKSPACE } from "../constants/localStorage";
import { useNavigate } from "react-router-dom";

interface WorkspaceContextType {
    workspaceKey: string | null;
    setWorkspaceKey: (key: string | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [workspaceKey, setWorkspaceKey] = useState<string | null>(
        localStorage.getItem(LOCAL_STORAGE_WORKSPACE)
    );

    const handleSetWorkspace = (key: string | null) => {
        if (key) localStorage.setItem(LOCAL_STORAGE_WORKSPACE, key);
        else localStorage.removeItem(LOCAL_STORAGE_WORKSPACE);
        setWorkspaceKey(key);
    };

    return (
        <WorkspaceContext.Provider value={{ workspaceKey, setWorkspaceKey: handleSetWorkspace }}>
            {children}
        </WorkspaceContext.Provider>
    );
};
export const useLogoutWorkspace = () => {
    const navigate = useNavigate();
    const { setWorkspaceKey } = useWorkspace();

    const logout = () => {
        setWorkspaceKey(null);

        localStorage.removeItem(ACCESS_TOKEN);

        navigate("/");
    };

    return logout;
};

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    if (!context) throw new Error("useWorkspace must be used within a WorkspaceProvider");
    return context;
};
