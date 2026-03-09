import './Controls.css'

export default function Controls() {
  return (
    <div className="controls-container">
      <div className="controls-panel">
        <h2>Hierarchical Transforms</h2>

        {/* Hierarchy visualization */}
        <div className="control-section">
          <h3>Scene Hierarchy</h3>
          <div className="hierarchy-tree">
            <div className="tree-node level-0">
              <span className="node-color" style={{ background: '#4a9eff' }} />
              <span className="node-label">Parent — Cube</span>
              <span className="node-level">Level 1</span>
            </div>
            <div className="tree-node level-1">
              <span className="node-color" style={{ background: '#10b981' }} />
              <span className="node-label">Child — Sphere</span>
              <span className="node-level">Level 2</span>
            </div>
            <div className="tree-node level-2">
              <span className="node-color" style={{ background: '#f59e0b' }} />
              <span className="node-label">Grandchild — Torus</span>
              <span className="node-level">Level 3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
