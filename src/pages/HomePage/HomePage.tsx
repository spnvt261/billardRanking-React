import { Navigate } from 'react-router-dom';
import PATHS from '../../router/path';
import './HomePage.css'
import ListWorkSpaces from '../../components/layout/home/ListWorkspaces';
import { useWorkspace } from '../../customhook/useWorkspace';
import FormToggle from '../../components/forms/FormToggle';
import FormJoinWorkSpace from '../../components/forms/workspace/joinWorkspace/FormJoinWorkSpace';
import FormAddWorkSpace from '../../components/forms/workspace/addWorkspaceForm/FormAddWorkSpace';
const Home: React.FC = () => {
    const { workspaceKey, workspaceList } = useWorkspace()
    if (workspaceKey) {
        return <Navigate to={PATHS.RANKINGS} replace />;
    }

    return (
        <div className="home-pages flex flex-col flex-1 w-full h-full">
            <div
                className={`
        flex 
        w-full h-full mb-4
        ${workspaceList.length > 0 ? '' : 'flex-1 justify-center items-center flex-wrap'}
      `}
            >
                <div className={`flex ${workspaceList.length > 0 ? '' : 'flex-col '} md:flex-row justify-center items-center gap-4`}>
                    <FormToggle
                        btnLabel="Vào Workspace"
                        formTitle="Nhập workspace key để tham gia"
                        element={FormJoinWorkSpace}
                        formWidth="400px"
                        className="w-auto "
                    />
                    <FormToggle
                        btnLabel="Tạo Workspace"
                        formTitle="Tạo workspace mới"
                        element={FormAddWorkSpace}
                        // formWidth="400px"
                        className="w-auto "
                    />
                </div>
            </div>

            <ListWorkSpaces />
        </div>
    );

};

export default Home;
