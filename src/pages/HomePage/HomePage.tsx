import { Navigate } from 'react-router-dom';
import PATHS from '../../router/path';
import './HomePage.css'
import ListWorkSpaces from '../../components/layout/home/ListWorkspaces';
import { useWorkspace } from '../../customhook/useWorkspace';
import FormToggle from '../../components/forms/FormToggle';
import FormJoinWorkSpace from '../../components/forms/workspace/joinWorkspace/FormJoinWorkSpace';
import FormAddWorkSpace from '../../components/forms/workspace/addWorkspaceForm/FormAddWorkSpace';
const Home: React.FC = () => {
    const {workspaceKey} = useWorkspace()
    if (workspaceKey) {
        return <Navigate to={PATHS.RANKINGS} replace />;
    }

    return (
        <div className="home-pages">
            <div className='flex'>
                <FormToggle
                    btnLabel='Vào Workspace'
                    formTitle='Nhập workspace key để tham gia'
                    element={FormJoinWorkSpace}
                    className='mr-2 mb-4'
                />
                <FormToggle
                    btnLabel='Tạo Workspace'
                    formTitle='Tạo workspace mới'
                    element={FormAddWorkSpace}
                    className='mb-4'
                />
            </div>
            <ListWorkSpaces/>
        </div>
    );
};

export default Home;
