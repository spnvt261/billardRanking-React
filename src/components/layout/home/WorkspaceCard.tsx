import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PATHS from "../../../router/path";
import { useWorkspace } from "../../../context/WorkspaceContext";

interface WorkspaceCardProps {
    name: string;
    workspaceKey: number;
}
const formatKey = (key: number) => {
    const keyStr = key.toString().padStart(8, "0");
    return `${keyStr.slice(0, 4)}-${keyStr.slice(4)}`;
};
const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ name, workspaceKey }) => {
    const [showKey, setShowKey] = useState(false);
    const { setWorkspaceKey } = useWorkspace();
    const navigate = useNavigate();
    const btnWorkspaceChosen = () => {
        setWorkspaceKey(workspaceKey.toString());
        navigate(PATHS.RANKINGS);
    }
    return (
        <div className="w-full max-w-[400px] p-4 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={btnWorkspaceChosen}
        >
            <div className="flex flex-col space-y-3">
                <h2 className="text-lg font-semibold text-slate-700">{name}</h2>
                <div className="flex items-center">
                    <div className="text-lg text-slate-600 mr-2">
                        <p>KEY:</p>
                    </div>
                    <div className="text-gray-600 text-sm font-mono w-[110px] tracking-[0.2rem]">
                        {showKey ? formatKey(workspaceKey) : "•••••••••"}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowKey((prev) => !prev);
                        }}
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        aria-label="Toggle key visibility"
                    >
                        {showKey ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkspaceCard;
