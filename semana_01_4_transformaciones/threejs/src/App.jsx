import { useState } from 'react'
import ModelViewer from './components/ModelViewer'
import Controls from './components/Controls'
import './App.css'

function App() {
  const [enableTranslation, setEnableTranslation] = useState(true)
  const [enableRotation, setEnableRotation] = useState(true)
  const [enableScale, setEnableScale] = useState(true)
  const [speed, setSpeed] = useState(1)

  return (
    <div className="app-container">
      <Controls
        enableTranslation={enableTranslation}
        setEnableTranslation={setEnableTranslation}
        enableRotation={enableRotation}
        setEnableRotation={setEnableRotation}
        enableScale={enableScale}
        setEnableScale={setEnableScale}
        speed={speed}
        setSpeed={setSpeed}
      />
      
      <div className="viewer-container">
        <ModelViewer
          enableTranslation={enableTranslation}
          enableRotation={enableRotation}
          enableScale={enableScale}
          speed={speed}
        />
      </div>
    </div>
  )
}

export default App
