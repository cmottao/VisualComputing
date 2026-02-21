import { useState } from 'react'
import ModelViewer from './components/ModelViewer'
import Controls from './components/Controls'
import './App.css'

function App() {
  const [viewMode, setViewMode] = useState('faces')
  const [modelPath, setModelPath] = useState('')
  const [modelData, setModelData] = useState(null)

  const handleModelLoad = (data) => {
    setModelData(data)
  }

  return (
    <div className="app-container">
      <Controls
        viewMode={viewMode}
        setViewMode={setViewMode}
        modelData={modelData}
        modelPath={modelPath}
        setModelPath={setModelPath}
      />
      
      <div className="viewer-container">
        <ModelViewer
          modelPath={modelPath}
          viewMode={viewMode}
          onModelLoad={handleModelLoad}
        />
      </div>
    </div>
  )
}

export default App
