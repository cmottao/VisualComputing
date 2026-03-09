import SceneViewer from './components/SceneViewer'
import Controls from './components/Controls'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Controls />
      <div className="viewer-container">
        <SceneViewer />
      </div>
    </div>
  )
}

export default App
