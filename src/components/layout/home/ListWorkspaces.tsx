import { useWorkspace } from "../../../customhook/useWorkspace";
import WorkspaceCard from "./WorkspaceCard";
import { motion, AnimatePresence } from "framer-motion";

const ListWorkSpaces = () => {
    const { workspaceList } = useWorkspace();

    return (
        <>
            {workspaceList.length !== 0 && (
                <h2 className="text-xl font-bold mb-4 text-slate-500">WORKSPACES ĐÃ VÀO</h2>
            )}
            <AnimatePresence>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                
                    {workspaceList
                        .slice()
                        .reverse() // để card mới hiện đầu
                        .map((item) => (
                            <motion.div
                                key={item.id}
                                layout // để animation trôi card mượt
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                                // whileTap={{ scale: 0.9 }}
                                className="w-full"
                            >
                                <WorkspaceCard
                                    name={item.name}
                                    workspaceKey={item.shareKey}
                                    isAdmin={item.isAdmin ? item.isAdmin : false}
                                />
                            </motion.div>
                        ))}
                
            </div>
            </AnimatePresence>
        </>
    );
};

export default ListWorkSpaces;
