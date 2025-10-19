import React, { useRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useWorkspace } from "../../../customhook/useWorkspace";
import FormToggle from "../../forms/FormToggle";
import FormConfirm from "../../forms/confirm/FormConfirm";
import { useNotification } from "../../../customhook/useNotifycation";
import FormJoinWorkSpace from "../../forms/workspace/joinWorkspace/FormJoinWorkSpace";
import { AnimatePresence, motion } from "framer-motion";

interface WorkspaceCardProps {
    name: string;
    workspaceKey: number;
    isAdmin?: boolean;
    workspaceId:number
}
const formatKey = (key: number) => {
    const keyStr = key.toString().padStart(8, "0");
    return `${keyStr.slice(0, 4)}-${keyStr.slice(4)}`;
};
const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ name, workspaceKey, isAdmin,workspaceId }) => {
    const { removeWorkspace, setWorkspaceKey,setWorkspaceId } = useWorkspace();
    const [showKey, setShowKey] = useState(false);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const cardRef = useRef<HTMLDivElement>(null);
    const { notify } = useNotification();
    const btnWorkspaceChosen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAdmin && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setOrigin({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
            setShowJoinForm(true);
            return;
        }
        setWorkspaceId(workspaceId.toString());
        setWorkspaceKey(workspaceKey.toString());
        notify(`Đã vào nhóm '${name}'`, 'success');
    }
    const handleDelete = () => {
        removeWorkspace(workspaceKey.toString())
        notify('Đã xóa nhóm', 'success');
    }
    return (
        <div className="relative">
            <AnimatePresence>
                {showJoinForm && (
                    <motion.div
                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-10 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, pointerEvents: 'none' }}
                        onClick={() => setShowJoinForm(false)}
                    >
                        <motion.div
                            className="content-wrapper bg-white rounded-2xl shadow-lg p-[2px] max-w-[400px] w-full mx-4"
                            initial={{
                                scale: 0,
                                x: origin.x - window.innerWidth / 2 + origin.width / 2,
                                y: origin.y - window.innerHeight / 2 + origin.height / 2,
                            }}
                            animate={{ scale: 1, x: 0, y: 0 }}
                            exit={{
                                scale: 0,
                                x: origin.x - window.innerWidth / 2 + origin.width / 2,
                                y: origin.y - window.innerHeight / 2 + origin.height / 2,
                            }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            onClick={(e) => e.stopPropagation()} // tránh click ngoài đóng form
                        >
                            <div className="p-6 rounded-2xl shadow-2xl max-h-[600px] overflow-y-auto hide-scrollbar">
                                <h3 className="text-xl font-bold mb-2">Đăng nhập vào nhóm '{name}'</h3>
                                <FormJoinWorkSpace
                                    btnCancel={() => setShowJoinForm(false)}
                                    keyValue={workspaceKey.toString()}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div
                ref={cardRef}
                className=" w-full max-w-[400px] relative p-4 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer
                    active:scale-[0.95] transition-transform duration-200
                "
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
                        formTitle={`Bạn có chắc chắn muốn rời workspace '${name}'`}
                        element={FormConfirm}
                        onConfirm={handleDelete}
                    />
                </div>
        </div>

    );
};

export default WorkspaceCard;
