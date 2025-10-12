import { workspaces } from "../../../data/workspaces"
import WorkspaceCard from "./WorkspaceCard"

const ListWorkSpaces = () => {
    return (
        <div className="
            grid 
        gap-4 
        sm:grid-cols-1 
        md:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 
        2xl:grid-cols-5 
        justify-items-center
        ">
            {
                workspaces.map((item) => {
                    return (
                        <WorkspaceCard key={item.id} name={item.name} workspaceKey={item.share_key} />

                    )
                }
                )
            }
        </div>
    )
}

export default ListWorkSpaces