import { useState } from 'react'
import ModelViewer from './components/ModelViewer'
import Controls from './components/Controls'
import './App.css'

function App() {
  const [viewMode, setViewMode] = useState('faces')
  const [currentFormat, setCurrentFormat] = useState('gltf') // Current active format
  const [modelData, setModelData] = useState(null)
  
  // Store paths for each format
  const [models, setModels] = useState({
    gltf: '',
    obj: '',
    stl: ''
  })

  const handleModelLoad = (data) => {
    setModelData(data)
  }

  // Update model path for a specific format
  const handleFormatUpload = (format, path) => {
    setModels(prev => ({
      ...prev,
      [format]: path
    }))
  }

  return (
    <div className="app-container">
      <Controls
        viewMode={viewMode}
        setViewMode={setViewMode}
        modelData={modelData}
        currentFormat={currentFormat}
        setCurrentFormat={setCurrentFormat}
        models={models}
        onFormatUpload={handleFormatUpload}
      />
      
      <div className="viewer-container">
        <ModelViewer
          modelPath={models[currentFormat]}
          format={currentFormat}
          viewMode={viewMode}
          onModelLoad={handleModelLoad}
        />
      </div>
    </div>
  )
}

export default App
