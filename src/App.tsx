
import './App.css'
import { WorkspaceProvider } from './customhook/useWorkspace'
import AppRouters from './router/AppRouter'

function App() {


  return (
    <WorkspaceProvider>
      <AppRouters />
    </WorkspaceProvider>

  )
}

export default App
