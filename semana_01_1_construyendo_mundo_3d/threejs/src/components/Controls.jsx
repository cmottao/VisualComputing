import './Controls.css'

export default function Controls({
  viewMode,
  setViewMode,
  modelData,
  modelPath,
  setModelPath
}) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setModelPath(url)
    }
  }

  return (
    <div className="controls-container">
      <div className="controls-panel">
        <h2>3D Model Viewer</h2>
        
        {/* Model Selection */}
        <div className="control-section">
          <h3>Load Model</h3>
          <div className="file-upload">
            <label htmlFor="file-input" className="file-label">
              Choose 3D Model (.gltf, .glb)
            </label>
            <input
              id="file-input"
              type="file"
              accept=".gltf,.glb"
              onChange={handleFileUpload}
              className="file-input"
            />
          </div>
          {modelPath && (
            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#4a9eff' }}>
              ✓ Model loaded
            </div>
          )}
        </div>

        {/* Visualization Mode - Only show when model is loaded */}
        {modelPath && (
          <div className="control-section">
            <h3>Visualization Mode</h3>
            <div className="button-group-vertical">
              <button
                className={viewMode === 'faces' ? 'active' : ''}
                onClick={() => setViewMode('faces')}
              >
                Faces
              </button>
              <button
                className={viewMode === 'wireframe' ? 'active' : ''}
                onClick={() => setViewMode('wireframe')}
              >
                Wireframe
              </button>
              <button
                className={viewMode === 'vertices' ? 'active' : ''}
                onClick={() => setViewMode('vertices')}
              >
                Vertices
              </button>
            </div>
          </div>
        )}

        {/* Model Information */}
        {modelData && (
          <div className="control-section info-section">
            <h3>Model Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Vertices:</span>
                <span className="info-value">{modelData.vertices}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Faces:</span>
                <span className="info-value">{modelData.faces}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Edges:</span>
                <span className="info-value">{modelData.edges}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
