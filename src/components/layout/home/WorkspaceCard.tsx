import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PATHS from "../../../router/path";
import { useWorkspace } from "../../../customhook/useWorkspace";
import FormToggle from "../../forms/FormToggle";
import FormConfirm from "../../forms/confirm/FormConfirm";

interface WorkspaceCardProps {
    name: string;
    workspaceKey: number;
    isAdmin?: boolean;
}
const formatKey = (key: number) => {
    const keyStr = key.toString().padStart(8, "0");
    return `${keyStr.slice(0, 4)}-${keyStr.slice(4)}`;
};
const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ name, workspaceKey, isAdmin }) => {
    const { removeWorkspace } = useWorkspace();
    const [showKey, setShowKey] = useState(false);
    const { setWorkspaceKey } = useWorkspace();
    const navigate = useNavigate();
    const btnWorkspaceChosen = () => {
        setWorkspaceKey(workspaceKey.toString());
        navigate(PATHS.RANKINGS);
    }
    const handleDelete = ()=>{
        removeWorkspace(workspaceKey.toString())
    }
    return (
        <div className="w-full max-w-[400px] relative p-4 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={btnWorkspaceChosen}
        >
            <div className="flex flex-col space-y-3">
                <h2 className="text-lg font-semibold text-slate-700 flex items-center">{name}&nbsp;
                    {
                        isAdmin && <span className="mr-4 text-xs bg-red-500 rounded-[8px] p-1 text-white">ADMIN</span>
                    }
                </h2>
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
            <div className="absolute top-3 right-1 rounded-[1rem] p-3"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                {/* <MdDeleteForever  size={24} /> */}
                <FormToggle 
                    btnLabel="Delete"
                    btnVariant="type-6"
                    formTitle={`Bạn có chắc chắn muốn xóa workspace '${name}'`}
                    element={FormConfirm}
                    onConfirm={handleDelete}
                 />
            </div>
        </div>
    );
};

export default WorkspaceCard;
