import { Navigate } from 'react-router-dom';
import PATHS from '../../router/path';
import './HomePage.css'
import ListWorkSpaces from '../../components/layout/home/ListWorkspaces';
import { useWorkspace } from '../../context/WorkspaceContext';
const Home: React.FC = () => {
    const {workspaceKey} = useWorkspace()
    if (workspaceKey) {
        return <Navigate to={PATHS.RANKINGS} replace />;
    }

    return (
        <div className="home-pages">
            <h2 className="text-xl font-bold mb-4 text-slate-500">WORKSPACES</h2>
            {/* <CustomKeyField/> */}
            <ListWorkSpaces/>
        </div>
    );
};

export default Home;
