import './Controls.css'

export default function Controls({
  viewMode,
  setViewMode,
  modelData,
  currentFormat,
  setCurrentFormat,
  models,
  onFormatUpload
}) {
  const handleFileUpload = (format) => (event) => {
    const file = event.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onFormatUpload(format, url)
      setCurrentFormat(format) // Auto-switch to uploaded format
    }
  }

  // Check if a model is loaded for the current format
  const hasCurrentModel = models[currentFormat] && models[currentFormat] !== ''

  return (
    <div className="controls-container">
      <div className="controls-panel">
        <h2>3D Format Converter</h2>
        
        {/* Format Selection */}
        <div className="control-section">
          <h3>Active Format</h3>
          <div className="button-group">
            <button
              className={currentFormat === 'gltf' ? 'active' : ''}
              onClick={() => setCurrentFormat('gltf')}
              disabled={!models.gltf}
            >
              GLTF
            </button>
            <button
              className={currentFormat === 'obj' ? 'active' : ''}
              onClick={() => setCurrentFormat('obj')}
              disabled={!models.obj}
            >
              OBJ
            </button>
            <button
              className={currentFormat === 'stl' ? 'active' : ''}
              onClick={() => setCurrentFormat('stl')}
              disabled={!models.stl}
            >
              STL
            </button>
          </div>
        </div>

        {/* Upload Models */}
        <div className="control-section">
          <h3>Load Models</h3>
          
          <div className="upload-group">
            <label htmlFor="gltf-input" className={`file-label ${models.gltf ? 'loaded' : ''}`}>
              {models.gltf ? '✓ GLTF Loaded' : 'Upload GLTF/GLB'}
            </label>
            <input
              id="gltf-input"
              type="file"
              accept=".gltf,.glb"
              onChange={handleFileUpload('gltf')}
              className="file-input"
            />
          </div>

          <div className="upload-group">
            <label htmlFor="obj-input" className={`file-label ${models.obj ? 'loaded' : ''}`}>
              {models.obj ? '✓ OBJ Loaded' : 'Upload OBJ'}
            </label>
            <input
              id="obj-input"
              type="file"
              accept=".obj"
              onChange={handleFileUpload('obj')}
              className="file-input"
            />
          </div>

          <div className="upload-group">
            <label htmlFor="stl-input" className={`file-label ${models.stl ? 'loaded' : ''}`}>
              {models.stl ? '✓ STL Loaded' : 'Upload STL'}
            </label>
            <input
              id="stl-input"
              type="file"
              accept=".stl"
              onChange={handleFileUpload('stl')}
              className="file-input"
            />
          </div>
        </div>

        {/* Model Information */}
        {modelData && hasCurrentModel && (
          <div className="control-section info-section">
            <h3>Model Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Format:</span>
                <span className="info-value">.{currentFormat.toUpperCase()}</span>
              </div>
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
