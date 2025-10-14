import { useContext } from "react";
import { WorkspaceContext } from "../context/workspaceContext/WorkspaceContext";


export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    if (!context) throw new Error("useWorkspace must be used within a WorkspaceProvider");
    return context;
};
