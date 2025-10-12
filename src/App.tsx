
import './App.css'
import { WorkspaceProvider } from './context/WorkspaceContext'
import AppRouters from './router/AppRouter'

function App() {


  return (
    <WorkspaceProvider>
      <AppRouters />
    </WorkspaceProvider>

  )
}

export default App
