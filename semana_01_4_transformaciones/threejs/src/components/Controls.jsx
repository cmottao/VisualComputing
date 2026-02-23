import './Controls.css'

export default function Controls({
  enableTranslation,
  setEnableTranslation,
  enableRotation,
  setEnableRotation,
  enableScale,
  setEnableScale,
  speed,
  setSpeed
}) {
  return (
    <div className="controls-container">
      <div className="controls-panel">
        <h2>3D Transformations</h2>

        {/* Translation */}
        <div className="control-section">
          <h3>Translation (Circular)</h3>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={enableTranslation}
              onChange={(e) => setEnableTranslation(e.target.checked)}
            />
            <span className="toggle-text">
              {enableTranslation ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        {/* Rotation */}
        <div className="control-section">
          <h3>Rotation</h3>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={enableRotation}
              onChange={(e) => setEnableRotation(e.target.checked)}
            />
            <span className="toggle-text">
              {enableRotation ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        {/* Scale */}
        <div className="control-section">
          <h3>Scale</h3>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={enableScale}
              onChange={(e) => setEnableScale(e.target.checked)}
            />
            <span className="toggle-text">
              {enableScale ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        {/* Speed */}
        <div className="control-section">
          <h3>Speed</h3>
          <div className="slider-container">
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="slider"
            />
            <span className="slider-value">{speed.toFixed(1)}x</span>
          </div>
        </div>
      </div>
    </div>
  )
}
