
import './App.css'
import { AppProviders } from './context/AppProviders'
import AppRouters from './router/AppRouter'

function App() {


  return (
    <AppProviders>
      <AppRouters />
    </AppProviders>

  )
}

export default App
